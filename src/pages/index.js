import React, { useEffect, useState } from "react";
import { Table, Select, Switch, Spin, InputNumber } from "antd";
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

			// Limpiar datos importados anteriores
			setImportedData([]); // Limpiar datos anteriores
			setTimeout(() => {
				setImportedData(jsonData); // Guardar datos importados
				setLoading(false); // Finalizar carga
			}, 0); // Retraso de 1 segundo
		};
		reader.readAsArrayBuffer(file);
	};
	const mergedData = data.map((item) => {
		const importedItem = importedData.find(
			(i) =>
				i.articleId &&
				item.articleId &&
				i.articleId.toString() === item.articleId.toString()
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
			width: "10%",
			rowScope: "row",
			fixed: "left",
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
			width: "20%",
			ellipsis: true,
			rowScope: "row",
			fixed: "left",
		},
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>COSTO NETO</h3>,
			children: [
				//{
				//	title: "Costo Bruto",
				//	dataIndex: "grossCost",
				//	key: "grossCost",
				//	align: "right",
				//	width: "7%",
				//	render: (text, record) =>
				//		showWithIVA
				//			? formatearNumero(record.grossCost * 1.21)
				//			: formatearNumero(record.grossCost), // Aplica IVA si está activado
				//},
				{
					title: "Costo",
					dataIndex: "netCost",
					key: "netCost",
					align: "right",
					width: "5%",
					render: (text, record) =>
						showWithIVA
							? formatearNumero(record.netCost * 1.21)
							: formatearNumero(record.netCost), // Aplica IVA si está activado
				},
				{
					title: "🆕 Costo",
					dataIndex: "importedNetCost",
					key: "importedNetCost",
					align: "right",
					width: "5%",
					render: (text) =>
						loading ? (
							<Spin size="small" />
						) : text !== null ? (
							formatearNumero(text)
						) : (
							"-"
						), // Mostrar spinner si está cargando
				},
				{
					title: "Variación",
					dataIndex: "variation",
					key: "variation",
					align: "right",
					width: "5%",
					render: (_, record) => {
						// Cambia el primer parámetro a "_" para ignorarlo
						const { importedNetCost, netCost, grossCost } = record; // Desestructuración correcta
						if (importedNetCost === null || netCost === null) return "-"; // Si no hay valor
						const value = importedNetCost / grossCost; // Calcular variación
						const percentage = ((value - 1) * 100).toFixed(2); // Calcular porcentaje
						return (
							<span style={{ color: value > 1 ? "green" : "red" }}>
								{value > 1 ? <UpOutlined /> : <DownOutlined />}
								{Math.abs(percentage)}%
							</span>
						);
					},
				},
			],
		},
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>LISTA NORMAL</h3>,
			children: [
				{
					title: "Ganancia",
					dataIndex: "margin",
					key: "margin",
					align: "right",
					width: "5%",
					render: (value, record) => (
						<InputNumber
							type="number"
							defaultValue={record.prices[0]?.margin || ""}
							suffix="%"
							disabled
							style={{
								width: "100%",
								border: "0px",
								textAlign: "right",
								justifyItems: "right",
								padding: "0",
							}} // Asegura que el input ocupe el ancho completo
						/>
					), // Muestra el margen como texto
				},
				{
					title: "Precio",
					dataIndex: "netPrice",
					key: "netPrice",
					align: "right",
					width: "5%",
					render: (_, record) =>
						showWithIVA
							? formatearNumero(record.prices[0]?.netPrice * 1.21)
							: formatearNumero(record.prices[0]?.netPrice) || "N/A", // Aplica IVA si está activado
				},
				{
					title: "🆕 Ganancia",
					dataIndex: "margin",
					key: "margin",
					align: "right",
					width: "5%",
					render: (value, record) => (
						<InputNumber
							type="number"
							defaultValue={record.prices[0]?.margin || ""}
							suffix="%"
							style={{ width: "100%", border: "0px", textAlign: "right" }} // Asegura que el input ocupe el ancho completo
						/>
					), // Accede al margen
				},
				{
					title: "🆕 Precio",
					dataIndex: "netPrice",
					key: "netPrice",
					align: "right",
					width: "5%",
					render: (_, record) =>
						showWithIVA
							? formatearNumero(record.prices[0]?.netPrice * 1.21)
							: formatearNumero(record.prices[0]?.netPrice) || "N/A", // Aplica IVA si está activado
				},

				{
					title: "Variación",
					dataIndex: "variation",
					key: "variation",
					align: "right",
					width: "5%",
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
			],
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
				bordered
				columns={columns}
				dataSource={mergedData}
				rowKey="articleId"
				pagination={{ pageSize: 200 }}
			/>
		</div>
	);
};

export default IndexPage;

function formatearNumero(num) {
	// Convierte el número a un string con dos decimales
	let partes = num.toFixed(2).split(".");
	const entero = partes[0];
	const decimal = partes[1];

	// Añade el separador de miles
	partes[0] = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

	// Une las partes con la coma para los decimales
	return <span>${partes[0]}</span>;
	return (
		<span>
			${partes[0]},
			<span style={{ color: "gray", fontSize: "small" }}>{decimal}</span>
		</span>
	);
}
