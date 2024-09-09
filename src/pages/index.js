import React, { useEffect, useState } from "react";
import { Select, notification } from "antd";
import * as XLSX from "xlsx"; // Importar la biblioteca xlsx
import Header from "./components/header/Header";
import CustomTable from "./components/table/Table";

const IndexPage = () => {
	const [data, setData] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState(null); // Cambiar a null para indicar que no hay selección
	const [showWithIVA, setShowWithIVA] = useState(false); // Estado para el Switch
	const [importedData, setImportedData] = useState([]); // Estado para los datos importados
	const [loading, setLoading] = useState(false); // Estado para controlar la carga
	const [isModalVisible, setIsModalVisible] = useState(true); // Estado para manejar la visibilidad del modal
	const [modificationType, setModificationType] = useState();

	const [newMargins, setNewMargins] = useState({}); // Estado para almacenar newMargins
	const [newMarginsRBC, setNewMarginsRBC] = useState({}); // Estado para almacenar newMargins

	const [newPrices, setNewPrices] = useState({}); // Estado para almacenar newPrices
	const [newPricesRBC, setNewPricesRBC] = useState({}); // Estado para almacenar newPrices

	const [generalMargin, setGeneralMargin] = useState(0);
	const [generalMarginRBC, setGeneralMarginRBC] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			if (selectedGroup) {
				// Verifica si hay una agrupación seleccionada
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
			}
		};
		fetchData();
	}, [selectedGroup]); // Dependencia de selectedGroup

	const handleSave = async (modificationType) => {
		var payload = null;
		var payloadRBC = null;
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
			payloadRBC = {
				articles: data.map((item) => ({
					articleId: item.articleId,
					description: item.description,
					netCost: item.netCost, // Usar el costo neto importado o 0
					grossCost: item.netCost, // Usar el costo neto importado o 0
					margin: newMarginsRBC[item.articleId] || 0, // Usar el nuevo margen o 0
					netPrice: newPricesRBC[item.articleId] || 0, // Usar el nuevo precio o 0
				})),
			};
		}

		console.log("Payload para guardar LISTA NORMAL:", payload); // Verifica el contenido del payload
		console.log("Payload para guardar LISTA RBC:", payloadRBC); // Verifica el contenido del payload
		try {
			const response = await fetch(
				"http://localhost:4000/api/articles/updateList?list_id=3",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payloadRBC),
				}
			);
			if (!response.ok) {
				throw new Error("Error al guardar los datos");
			}
			const result = await response.json();
			notification.success({
				message: "Lista RBC actualizada ",
				//description: result.message, // Mensaje devuelto por el servidor
			});
		} catch (error) {
			console.error("Error al enviar los datos:", error);
		}
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
			notification.success({
				message: "Lista Normal actualizada ",
				//description: result.message, // Mensaje devuelto por el servidor
			});
		} catch (error) {
			console.error("Error al enviar los datos:", error);
		}
	};

	const applyGeneralMargin = () => {
		let updatedMargins = {};
		let updatedPrices = {};
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
		console.log("UPDATED MARGINS", updatedMargins);
		console.log("UPDATED PRICES", updatedPrices);
		setNewMargins(updatedMargins); // Actualizar el estado de newMargins
		setNewPrices(updatedPrices); // Actualizar el estado de newPrices
	};

	const applyGeneralMarginRBC = () => {
		let updatedMargins = {};
		let updatedPrices = {};
		mergedData.forEach((record) => {
			const articleId = record.articleId;
			const importedNetCost = record.netCost || 0; // Obtener el costo neto importado
			// Asignar el porcentaje general a cada artículo
			updatedMargins[articleId] = generalMarginRBC;
			// Calcular el nuevo precio utilizando el porcentaje general
			const calculatedNewPrice = importedNetCost * (1 + generalMarginRBC / 100);
			updatedPrices[articleId] = calculatedNewPrice;
			// Llamar a handleNewMarginChange para actualizar newMargins y newPrices
			handleNewMarginChange(generalMargin, record);
		});
		setNewMarginsRBC(updatedMargins); // Actualizar el estado de newMargins
		setNewPricesRBC(updatedPrices); // Actualizar el estado de newPrices
	};

	//prettier-ignore
	const handleNewMarginChange = (value, record) => {
		let newMargin = value; // Obtener el nuevo margen
		let importedNetCost = record.netCost || 0; // Obtener el costo neto importado
		const calculatedNewPrice =  (record.netCost || 0) * (1 + newMargin / 100); // Calcular el nuevo precio
		// Actualizar el estado de newMargins y newPrices
    console.log("NEW MARGINS", newMargins);
    console.log("NET COST", record.importedNetCost);
    console.log("CALCULATED NEW PRICE", calculatedNewPrice);
		setNewMargins((prev) => ({...prev,[record.articleId]: newMargin,}));
		setNewPrices((prev) => ({...prev,[record.articleId]: calculatedNewPrice,}));
	};

	//prettier-ignore
	const handleNewMarginChangeRBC = (value, record) => {
		let newMarginRBC = value; // Obtener el nuevo margen
		let importedNetCost = record.netCost || 0; // Obtener el costo neto importado
		const calculatedNewPrice =  (record.netCost || 0) * (1 + newMarginRBC / 100); // Calcular el nuevo precio
		// Actualizar el estado de newMargins y newPrices
    console.log("NEW MARGINS RBC", newMarginsRBC);
    console.log("NET COST RBC", record.netCost);
    console.log("CALCULATED NEW PRICE RBC", calculatedNewPrice);
		setNewMarginsRBC((prev) => ({...prev,[record.articleId]: newMarginRBC,	})); // Usar articleId como clave
		setNewPricesRBC((prev) => ({...prev,	[record.articleId]: calculatedNewPrice,		}));
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
	const [searchText, setSearchText] = useState("");
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
				setSearchText={setSearchText}
				modificationType={modificationType}
			/>

			<CustomTable
				searchText={searchText}
				data={data}
				loading={loading}
				showWithIVA={showWithIVA}
				modificationType={modificationType}
				//especficio listas
				setNewMargins={setNewMargins}
				setNewMarginsRBC={setNewMarginsRBC}
				//especifico de lista
				handleNewMarginChange={handleNewMarginChange}
				handleNewMarginChangeRBC={handleNewMarginChangeRBC}
				//especifico de lista
				generalMargin={generalMargin}
				generalMarginRBC={generalMarginRBC}
				//especifico de lista
				setGeneralMargin={setGeneralMargin}
				setGeneralMarginRBC={setGeneralMarginRBC}
				//especifico de lista
				applyGeneralMargin={applyGeneralMargin}
				applyGeneralMarginRBC={applyGeneralMarginRBC}
				//especifico de lista
				newMargins={newMargins}
				newMarginsRBC={newMarginsRBC}
				//especifico de lista
				newPrices={newPrices}
				newPricesRBC={newPricesRBC} //especifico de lista
			/>
		</>
	);
};

export default IndexPage;
