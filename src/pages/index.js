import React, { useEffect, useState } from "react";
import { notification } from "antd";
import Header from "./components/header/Header";
import CustomTable from "./components/table/Table";

const IndexPage = () => {
	const [data, setData] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState(null); // Cambiar a null para indicar que no hay selección
	const [showWithIVA, setShowWithIVA] = useState(false); // Estado para el Switch

	const [loading, setLoading] = useState(false); // Estado para controlar la carga
	const [isModalVisible, setIsModalVisible] = useState(true); // Estado para manejar la visibilidad del modal
	const [modificationType, setModificationType] = useState();
	const [reload, setReload] = useState(false);

	const [newMargins, setNewMargins] = useState({}); // Estado para almacenar newMargins
	const [newPrices, setNewPrices] = useState({}); // Estado para almacenar newPrices
	const [generalMargin, setGeneralMargin] = useState(0);

	const [newMarginsRBC, setNewMarginsRBC] = useState({}); // Estado para almacenar newMargins
	const [newPricesRBC, setNewPricesRBC] = useState({}); // Estado para almacenar newPrices
	const [generalMarginRBC, setGeneralMarginRBC] = useState(0);

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
		let payloadRBC = null;

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

		payloadRBC = {
			articles: data.map((item) => ({
				articleId: item.articleId,
				description: item.description,
				netCost: item.netCost, // Usar el costo neto importado o 0
				grossCost: item.netCost, // Usar el costo neto importado o 0
				margin: newMarginsRBC[item.articleId] || 0, // Usar el nuevo margen o 0
				netPrice:
					newPricesRBC[item.articleId] ||
					item.netCost * (1 + item.prices[3].margin / 100), // Usar el nuevo precio o 0
			})),
		};
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

		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/articles/updateList?list_id=2`,
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
				description: result.message, // Mensaje devuelto por el servidor
			});
			setReload((prev) => !prev);
		} catch (error) {
			console.error("Error al enviar los datos:", error);
		}
	};

	const applyGeneralMargin = () => {
		const updatedMargins = {};
		const updatedPrices = {};
		data.forEach((record) => {
			const { articleId, netCost } = record;
			updatedMargins[articleId] = generalMargin;
			updatedPrices[articleId] = netCost * (1 + generalMargin / 100);
			handleNewMarginChange(generalMargin, record);
		});
		setNewMargins(updatedMargins);
		setNewPrices(updatedPrices);
	};

	const applyGeneralMarginRBC = () => {
		const updatedMargins = {};
		const updatedPrices = {};
		data.forEach((record) => {
			const { articleId, netCost } = record;
			updatedMargins[articleId] = generalMarginRBC;
			updatedPrices[articleId] = netCost * (1 + generalMarginRBC / 100);
			handleNewMarginChangeRBC(generalMarginRBC, record);
		});
	};

	const handleNewMarginChange = (newMargin, { articleId, netCost = 0 }) => {
		const newPrice = netCost * (1 + newMargin / 100);
		setNewMargins((prev) => ({ ...prev, [articleId]: newMargin }));
		setNewPrices((prev) => ({ ...prev, [articleId]: newPrice }));
	};

	const handleNewMarginChangeRBC = (newMargin, { articleId, netCost = 0 }) => {
		const newPrice = netCost * (1 + newMargin / 100);
		setNewMarginsRBC((prev) => ({ ...prev, [articleId]: newMargin }));
		setNewPricesRBC((prev) => ({ ...prev, [articleId]: newPrice }));
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
				loading={loading}
				data={data}
				searchText={searchText}
				modificationType={modificationType}
				//
				applyGeneralMargin={applyGeneralMargin}
				applyGeneralMarginRBC={applyGeneralMarginRBC}
				//
				generalMargin={generalMargin}
				generalMarginRBC={generalMarginRBC}
				//
				handleNewMarginChange={handleNewMarginChange}
				handleNewMarginChangeRBC={handleNewMarginChangeRBC}
				//
				newMargins={newMargins}
				newMarginsRBC={newMarginsRBC}
				//
				newPrices={newPrices}
				newPricesRBC={newPricesRBC}
				//
				setGeneralMargin={setGeneralMargin}
				setGeneralMarginRBC={setGeneralMarginRBC}
				//
				setNewMargins={setNewMargins}
				setNewMarginsRBC={setNewMarginsRBC}
				showWithIVA={showWithIVA}
			/>
		</>
	);
};

export default IndexPage;
