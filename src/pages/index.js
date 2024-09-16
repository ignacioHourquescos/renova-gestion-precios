import React, { useEffect, useState } from "react";
import { notification } from "antd";
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
	const [reload, setReload] = useState(false);

	const [newMargins, setNewMargins] = useState({}); // Estado para almacenar newMargins

	const [newPrices, setNewPrices] = useState({}); // Estado para almacenar newPrices

	const [generalMargin, setGeneralMargin] = useState(0);

	useEffect(() => {
		console.log("ENTRO AL USE EFFECT");
		setReload();
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
	}, [selectedGroup, reload]); // Dependencia de selectedGroup

	const handleSave = async () => {
		let payload = null;

		payload = {
			articles: data.map((item) => ({
				articleId: item.articleId,
				description: item.description,
				netCost: item.netCost, // Usar el costo neto importado o 0
				grossCost: item.netCost, // Usar el costo neto importado o 0
				margin: newMargins[item.articleId] || 0, // Usar el nuevo margen o 0
				netPrice:
					newPrices[item.articleId] ||
					item.netCost * (1 + item.prices[2].margin / 100), // Usar el nuevo precio o 0
			})),
		};
		console.log("PAYLOAD DATA ARRAY", payload);
		console.log("Payload para guardar LISTA NORMAL:", payload.articles[0]);

		console.log("CALCULO NET PRICE", data[0].netCost, data[0].margin);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/articles/updateList?list_id=2`,
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
				description: result.message, // Mensaje devuelto por el servidor
			});
			setReload((prev) => !prev);
		} catch (error) {
			console.error("Error al enviar los datos:", error);
		}
	};

	const applyGeneralMargin = (list_id) => {
		let updatedMargins = {};
		let updatedPrices = {};
		data.forEach((record) => {
			console.log("RECORD MARGIN FROM RP", record.prices[list_id]?.margin);
			const articleId = record.articleId;
			updatedMargins[articleId] = generalMargin;
			const calculatedNewPrice = record.netCost * (1 + generalMargin / 100);
			updatedPrices[articleId] = calculatedNewPrice;
			handleNewMarginChange(generalMargin, record);
		});
		console.log("UPDATED MARGIN FROM applyGeneralMargin", updatedMargins);
		console.log("UPDATED PRICES FROM applyGeneralMargin", updatedPrices);
		setNewMargins(updatedMargins); // Actualizar el estado de newMargins
		setNewPrices(updatedPrices); // Actualizar el estado de newPrices
	};

	//prettier-ignore
	const handleNewMarginChange = (value, record) => {
		let newMargin = value; // Obtener el nuevo margen
		const calculatedNewPrice =  (record.netCost || 0) * (1 + newMargin / 100); // Calcular el nuevo precio
		// Actualizar el estado de newMargins y newPrices
    console.log("NEW MARGINS FROM handleNewMarginChange", newMargins);
    console.log("NET COST RP FROM handleNewMarginChange", record.netCost);
    console.log("CALCULATED NEW PRICE FROM handleNewMarginChange", calculatedNewPrice);
		setNewMargins((prev) => ({...prev,[record.articleId]: newMargin,}));
		setNewPrices((prev) => ({...prev,[record.articleId]: calculatedNewPrice,}));
	};

	const handleGroupChange = (value) => {
		setSelectedGroup(value); // Actualiza la agrupación seleccionada
	};
	const handleSwitchChange = (checked) => {
		setShowWithIVA(checked); // Actualiza el estado del Switch
	};

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
				//especifico de lista
				handleNewMarginChange={handleNewMarginChange}
				//especifico de lista
				generalMargin={generalMargin}
				//especifico de lista
				setGeneralMargin={setGeneralMargin}
				applyGeneralMargin={applyGeneralMargin}
				//especifico de lista
				newMargins={newMargins}
				//especifico de lista
				newPrices={newPrices}
			/>
		</>
	);
};

export default IndexPage;
