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
import NormalTable from "./components/NormalTable";
import Header from "./components/header/Header";
import CustomTable from "./components/NormalTable";

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

	const handleModalClose = () => {
		setIsModalVisible(false); // Cerrar el modal
	};

	return (
		<>
			<Header // Usar el nuevo componente Header
				isModalVisible={isModalVisible}
				handleModalClose={handleModalClose}
				setModificationType={setModificationType}
				selectedGroup={selectedGroup}
				handleGroupChange={handleGroupChange}
				handleImportExcel={handleImportExcel}
				showWithIVA={showWithIVA}
				handleSwitchChange={handleSwitchChange}
				handleSave={handleSave}
			/>

			<CustomTable
				data={data}
				newMargins={newMargins}
				setNewMargins={setNewMargins}
				newPrices={newPrices}
				modificationType={modificationType}
				showWithIVA={showWithIVA}
				handleNewMarginChange={handleNewMarginChange}
				generalMargin={generalMargin}
				setGeneralMargin={setGeneralMargin}
				applyGeneralMargin={applyGeneralMargin}
				loading={loading}
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
