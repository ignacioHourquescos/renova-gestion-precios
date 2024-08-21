import React, { useEffect, useState } from "react";
import {
	Table,
	Select,
	Switch,
	Spin,
	InputNumber,
	Button,
	notification,
	Modal,
} from "antd";
import { groups } from "./dummy_agrupation";
import * as XLSX from "xlsx"; // Importar la biblioteca xlsx
import {
	UpOutlined,
	DownOutlined,
	ThunderboltOutlined,
} from "@ant-design/icons"; // Importar íconos
import { variationFormatter } from "../utils";

const { Option } = Select;

const IndexPage = () => {
	const [data, setData] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState(1); // Agrupación por defecto
	const [showWithIVA, setShowWithIVA] = useState(false); // Estado para el Switch
	const [importedData, setImportedData] = useState([]); // Estado para los datos importados
	const [loading, setLoading] = useState(false); // Estado para controlar la carga
	const [newMargins, setNewMargins] = useState({}); // Estado para almacenar newMargins
	const [newPrices, setNewPrices] = useState({}); // Estado para almacenar newPrices
	const [generalMargin, setGeneralMargin] = useState(0);
	const [isModalVisible, setIsModalVisible] = useState(true); // Estado para manejar la visibilidad del modal
	const [modificationType, setModificationType] = useState();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`http://localhost:4000/api/articles/articles?agrupation=${selectedGroup}`
				);
				const result = await response.json();
				console.log(result);
				setData(result);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [selectedGroup]);

	const handleSave = async (modificationType) => {
		var payload = null;
		if (modificationType == "massive") {
			payload = {
				articles: mergedData.map((item) => ({
					articleId: item.articleId,
					description: item.description,
					netPrice: newPrices[item.articleId] || 0, // Usar el nuevo precio o 0
					netCost: item.importedNetCost || 0, // Usar el costo neto importado o 0
					grossCost: item.importedNetCost || 0, // Usar el costo neto importado o 0
					margin: newMargins[item.articleId] || 0, // Usar el nuevo margen o 0
				})),
			};
		} else {
			payload = {
				articles: data.map((item) => ({
					articleId: item.articleId,
					description: item.description,
					netCost: item.netCost, // Usar el costo neto importado o 0
					grossCost: item.netCost, // Usar el costo neto importado o 0
					margin: newMargins[item.articleId] || 0, // Usar el nuevo margen o 0
					netPrice: newPrices[item.articleId] || 0, // Usar el nuevo precio o 0
				})),
			};
		}

		console.log("Payload para guardar:", payload); // Verifica el contenido del payload

		try {
			const response = await fetch(
				"http://localhost:4000/api/articles/updateList?list_id=2",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				}
			);
			if (!response.ok) {
				throw new Error("Error al guardar los datos");
			}
			const result = await response.json();
			console.log("Datos guardados:", result);
			notification.success({
				message: "Éxito",
				description: result.message, // Mensaje devuelto por el servidor
			});
		} catch (error) {
			console.error("Error al enviar los datos:", error);
		}
	};

	const applyGeneralMargin = () => {
		const updatedMargins = {};
		const updatedPrices = {};
		mergedData.forEach((record) => {
			const articleId = record.articleId;
			const importedNetCost = record.netCost || 0; // Obtener el costo neto importado
			// Asignar el porcentaje general a cada artículo
			updatedMargins[articleId] = generalMargin;
			// Calcular el nuevo precio utilizando el porcentaje general
			const calculatedNewPrice = importedNetCost * (1 + generalMargin / 100);
			updatedPrices[articleId] = calculatedNewPrice;
			// Llamar a handleNewMarginChange para actualizar newMargins y newPrices
			handleNewMarginChange(generalMargin, record);
		});
		setNewMargins(updatedMargins); // Actualizar el estado de newMargins
		setNewPrices(updatedPrices); // Actualizar el estado de newPrices
	};

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
		//article
		{
			title: "Article ID",
			dataIndex: "articleId",
			key: "articleId",
			width: "10%",
			//rowScope: "row",
			fixed: "left",
		},
		//description
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
			width: "15%",
			ellipsis: true,
			//rowScope: "row",
			fixed: "left",
		},
		//cost
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>COSTO NETO</h3>,
			children: [
				{
					title: "Costo RP",
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
					title: "NUEVO",
					dataIndex: "importedNetCost",
					key: "importedNetCost",
					align: "right",
					width: "5%",
					hidden: modificationType == "manual" ? true : false,
					render: (text) =>
						loading ? (
							<Spin size="small" />
						) : text !== null ? (
							showWithIVA ? (
								formatearNumero(text * 1.21) // Aplica IVA si está activado
							) : (
								formatearNumero(text)
							)
						) : (
							"-"
						),
				},
				{
					title: "△",
					dataIndex: "variation",
					key: "variation",
					align: "center",
					width: "3%",
					hidden: modificationType == "manual" ? true : false,
					render: (_, record) => {
						// Cambia el primer parámetro a "_" para ignorarlo
						const { importedNetCost, netCost, grossCost } = record; // Desestructuración correcta
						if (importedNetCost === null || netCost === null) return "-"; // Si no hay valor
						const value = importedNetCost / grossCost; // Calcular variación

						return variationFormatter(value); // Usar la función variationFormatter
					},
				},
			],
		},
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>LISTA NORMAL</h3>,
			children: [
				{
					title: (
						<div style={{ display: "flex" }}>
							<Button
								icon={<ThunderboltOutlined />}
								onClick={applyGeneralMargin}
								style={{ width: "50px" }}
							/>
							<InputNumber
								style={{ marginLeft: 8, width: 100 }}
								value={generalMargin}
								onChange={setGeneralMargin}
								suffix="%"
								className="percentaje"
							/>
						</div>
					),
					dataIndex: "newMargin",
					key: "newMargin",
					align: "right",
					width: "5%",
					render: (value, record) => {
						const initialMargin = record.prices[0]?.margin;
						// Si el artículo no tiene un nuevo margen, establecer el margen inicial
						if (!(record.articleId in newMargins)) {
							setNewMargins((prev) => ({
								...prev,
								[record.articleId]: initialMargin,
							}));
						}
						return (
							<InputNumber
								type="number"
								placeholder="test"
								value={newMargins[record.articleId] || initialMargin}
								onChange={(value) => handleNewMarginChange(value, record)}
								style={{ width: "100%" }}
								suffix="%"
								className="percentaje"
							/>
						);
					},
				},
				{
					title: "NUEVO",
					dataIndex: "newPrice",
					key: "newPrice",
					align: "right",
					width: "5%",
					render: (_, record) => {
						// Calcular el nuevo precio utilizando newMargins o el margen inicial

						const newPrice =
							modificationType == "massive"
								? newPrices[record.articleId] ||
								  record.importedNetCost *
										(1 +
											(newMargins[record.articleId] ||
												record.prices[0]?.margin) /
												100)
								: record.netCost *
								  (1 +
										(newMargins[record.articleId] || record.prices[0]?.margin) /
											100);
						return (
							<>
								{/* <div>RP - {record.prices[0]?.netPrice.toFixed(0)}</div> */}
								<div>new - {newPrice.toFixed(0)}</div>
							</>
						);
						return (
							<span>
								{showWithIVA
									? formatearNumero(newPrice * 1.21)
									: formatearNumero(newPrice) || "N/A"}
							</span>
						);
					},
				},
				{
					title: "△",
					dataIndex: "newVariation",
					key: "newVariation",
					align: "center",
					width: "3%",
					render: (_, record) => {
						const value =
							modificationType == "massive"
								? newPrices[record.articleId] / record.prices[0].netPrice
								: (record.netCost *
										(1 +
											(newMargins[record.articleId] ||
												record.prices[0]?.margin) /
												100)) /
								  record.prices[0].netPrice;

						return <>{variationFormatter(value)}</>;
					},
				},
			],
		},
	];

	const handleModalClose = () => {
		setIsModalVisible(false); // Cerrar el modal
	};

	return (
		<>
			<Modal
				title="Seleccione una opción"
				visible={isModalVisible}
				onCancel={handleModalClose}
				footer={null}
			>
				<Button
					type="primary"
					onClick={() => {
						handleModalClose();
						setModificationType("manual");
						// Acción para "Modificación Manual"
					}}
					block
				>
					Modificación Manual
				</Button>
				<Button
					type="default"
					onClick={() => {
						handleModalClose();
						setModificationType("massive");
						// Acción para "Subida de lista de precios"
					}}
					block
					style={{ marginTop: "10px" }}
				>
					Subida de lista de precios
				</Button>
			</Modal>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 16,
				}}
			>
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
				<>
					<span style={{ margin: "0px" }}>Precios sin IVA</span>
					<Switch checked={showWithIVA} onChange={handleSwitchChange} />
					<span style={{ marginLeft: 0 }}>Precios con IVA</span>{" "}
				</>
				<Button type="primary" onClick={handleSave}>
					Guardar
				</Button>
			</div>
			<Table
				bordered
				columns={columns}
				dataSource={mergedData}
				rowKey="articleId"
				pagination={{ pageSize: 200 }}
			/>
		</>
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
}
