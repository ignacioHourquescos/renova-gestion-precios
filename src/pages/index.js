import React, { useEffect, useState } from "react";
import { Table, Select, Switch, Spin } from "antd";
import { groups } from "./dummy_agrupation";
import * as XLSX from "xlsx"; // Importar la biblioteca xlsx
import { UpOutlined, DownOutlined } from "@ant-design/icons"; // Importar íconos

const { Option } = Select;

const IndexPage = () => {
	const [data, setData] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState(1); // Agrupación por defecto
	const [showWithIVA, setShowWithIVA] = useState(false); // Estado para el Switch
	const [importedData, setImportedData] = useState([]); // Estado para los datos importados
	const [loading, setLoading] = useState(false); // Estado para controlar la carga

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`http://localhost:4000/api/articles/articles?agrupation=${selectedGroup}`
				);
				const result = await response.json();
				setData(result);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [selectedGroup]);

	const handleGroupChange = (value) => {
		setSelectedGroup(value); // Actualiza la agrupación seleccionada
	};

	const handleSwitchChange = (checked) => {
		setShowWithIVA(checked); // Actualiza el estado del Switch
	};

	const handleImportExcel = (e) => {
		if (e.target.files.length === 0) {
			console.error("No file selected");
			return;
		}

		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (event) => {
			setLoading(true); // Iniciar carga
			const data = new Uint8Array(event.target.result);
			const workbook = XLSX.read(data, { type: "array" });
			const worksheet = workbook.Sheets[workbook.SheetNames[0]];
			const jsonData = XLSX.utils.sheet_to_json(worksheet);
			setImportedData(jsonData); // Guardar datos importados
			// Simular un retraso para mostrar el spinner
			setTimeout(() => {
				setImportedData(jsonData); // Guardar datos importados
				setLoading(false); // Finalizar carga
			}, 1000); // Retraso de 1 segundo
		};
		reader.readAsArrayBuffer(file);
	};

	const mergedData = data.map((item) => {
		const importedItem = importedData.find(
			(i) => i.articleId.toString() === item.articleId.toString()
		);
		return {
			...item,
			importedNetCost: importedItem ? importedItem.NetCost : null,
		};
	});

	const columns = [
		{
			title: "Article ID",
			dataIndex: "articleId",
			key: "articleId",
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Gross Cost",
			dataIndex: "grossCost",
			key: "grossCost",
			render: (text, record) =>
				(showWithIVA ? record.grossCost * 1.21 : record.grossCost).toFixed(2), // Aplica IVA si está activado
		},
		{
			title: "Net Cost",
			dataIndex: "netCost",
			key: "netCost",
			render: (text, record) =>
				(showWithIVA ? record.netCost * 1.21 : record.netCost).toFixed(2), // Aplica IVA si está activado
		},
		{
			title: "Margin",
			dataIndex: "margin",
			key: "margin",
			render: (_, record) => record.prices[0]?.margin + "%" || "N/A", // Accede al margen
		},
		{
			title: "Net Price",
			dataIndex: "netPrice",
			key: "netPrice",
			render: (_, record) =>
				(showWithIVA
					? record.prices[0]?.netPrice * 1.21
					: record.prices[0]?.netPrice || "N/A"
				).toFixed(2), // Aplica IVA si está activado
		},
		{
			title: "Imported Net Cost",
			dataIndex: "importedNetCost",
			key: "importedNetCost",
			render: (text) =>
				loading ? (
					<Spin size="small" />
				) : text !== null ? (
					text.toFixed(2)
				) : (
					"N/A"
				), // Mostrar spinner si está cargando
		},
		{
			title: "Variación",
			dataIndex: "variation",
			key: "variation",
			render: (value) => {
				if (value === null) return "N/A"; // Si no hay valor
				const percentage = ((value - 1) * 100).toFixed(2); // Calcular porcentaje
				return (
					<span style={{ color: value > 1 ? "green" : "red" }}>
						{value > 1 ? <UpOutlined /> : <DownOutlined />}
						{Math.abs(percentage)}%
					</span>
				);
			},
		},
	];

	return (
		<div>
			<input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} />
			<Select
				defaultValue={selectedGroup}
				style={{ width: 200, marginBottom: 16 }}
				onChange={handleGroupChange}
			>
				{groups.map((group) => (
					<Option key={group.code} value={group.code}>
						{group.description}
					</Option>
				))}
			</Select>
			<span style={{ margin: "0 16px" }}>Precios sin IVA</span>
			<Switch checked={showWithIVA} onChange={handleSwitchChange} />
			<span style={{ marginLeft: 16 }}>Precios con IVA</span>
			<Table
				columns={columns}
				dataSource={mergedData}
				rowKey="articleId"
				pagination={{ pageSize: 200 }}
			/>
		</div>
	);
};

export default IndexPage;
