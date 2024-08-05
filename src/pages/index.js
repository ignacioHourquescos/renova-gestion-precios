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
	const [newMargins, setNewMargins] = useState({}); // Estado para almacenar newMargins
	const [newPrices, setNewPrices] = useState({}); // Estado para almacenar newPrices
	const handleNewMarginChange = (value, record) => {
		const newMargin = value; // Obtener el nuevo margen
		const importedNetCost = record.importedNetCost || 0; // Obtener el costo neto importado
		const calculatedNewPrice = importedNetCost * (1 + newMargin / 100); // Calcular el nuevo precio

		// Actualizar el estado de newMargins y newPrices
		setNewMargins((prev) => ({
			...prev,
			[record.articleId]: newMargin, // Usar articleId como clave
		}));

		setNewPrices((prev) => ({
			...prev,
			[record.articleId]: calculatedNewPrice, // Usar articleId como clave
		}));
	};
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
			//rowScope: "row",
			fixed: "left",
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
			width: "20%",
			ellipsis: true,
			//rowScope: "row",
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
					title: "🆕Costo",
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
					dataIndex: "currentMargin",
					key: "margin",
					align: "right",
					width: "5%",
					render: (value, record) => (
						//<InputNumber
						//	type="number"
						//	defaultValue={record.prices[0]?.margin || ""}
						//	suffix="%"
						//	style={{
						//		width: "100%",
						//		border: "0px",
						//		textAlign: "right",
						//		justifyItems: "right",
						//		padding: "0",
						//		backgroundColor: "transparent",
						//	}} // Asegura que el input ocupe el ancho completo
						///>
						<span
							type="number"
							suffix="%"
							style={{
								width: "100%",
								border: "0px",
								textAlign: "right",
								justifyItems: "right",
								padding: "0",
								backgroundColor: "transparent",
							}} // Asegura que el input ocupe el ancho completo
						>
							{record.prices[0]?.margin || ""} %
						</span>
					), // Muestra el margen como texto
				},
				{
					title: "Precio",
					dataIndex: "currentPrice",
					key: "netPrice",
					align: "right",
					width: "5%",
					render: (_, record) => (
						<span
							style={{
								width: "100%",
								border: "0px",
								textAlign: "right",
								justifyItems: "right",
								padding: "0",
								backgroundColor: "transparent",
							}}
						>
							{showWithIVA
								? formatearNumero(record.prices[0]?.netPrice * 1.21)
								: formatearNumero(record.prices[0]?.netPrice) || "N/A"}{" "}
							{/* Aplica IVA si está activado */}
						</span>
					),
				},
				{
					title: "🆕 Ganancia",
					dataIndex: "newMargin",
					key: "newMargin",
					align: "right",
					width: "5%",
					render: (value, record) => (
						<InputNumber
							type="number"
							placeholder="test"
							value={newMargins[record.articleId] || record.prices[0]?.margin} // Usar el valor del estado o 0
							onChange={(value) => handleNewMarginChange(value, record)} // Manejar el cambio
							style={{ width: "100%" }} // Asegura que el input ocupe el ancho completo
						/>
					), // Accede al nuevo margen
				},
				{
					title: "🆕 Precio",
					dataIndex: "newPrice",
					key: "newPrice",
					align: "right",
					width: "5%",
					render: (_, record) => {
						const newPrice =
							newPrices[record.articleId] ||
							record.importedNetCost *
								(1 + (newMargins[record.articleId] || 0) / 100); // Calcular el nuevo precio

						return (
							<span>
								{/* Mostrar el nuevo precio con dos decimales */}
								{showWithIVA
									? formatearNumero(newPrice * 1.21)
									: formatearNumero(newPrice) || "N/A"}
							</span>
						);
					}, // Muestra el nuevo precio
				},

				{
					title: "🆕 Variación",
					dataIndex: "newVariation",
					key: "newVariation",
					align: "right",
					width: "5%",
					render: (_, record) => {
						const newPrice =
							newPrices[record.articleId] ||
							record.importedNetCost *
								(1 +
									(newMargins[record.articleId] || record.currentMargin) / 100); // Calcular el nuevo precio
						const netPrice = record.prices[0]?.netPrice || 1; // Asegúrate de que netPrice no sea 0 para evitar división por cero
						const value = newPrice / netPrice; // Calcular la variación
						const percentage = ((value - 1) * 100).toFixed(2); // Calcular porcentaje

						// Verificar si el valor está en el rango de -0.1 a 0.1
						if (percentage > -0.1 && percentage < 0.1) {
							return <span style={{ color: "gray" }}>0</span>; // Mostrar "0" en gris
						}
						return (
							<span style={{ color: value > 1 ? "green" : "red" }}>
								{value > 1 ? <UpOutlined /> : <DownOutlined />}
								{Math.abs(percentage)}%
							</span>
						);
					}, // Muestra la variación
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
