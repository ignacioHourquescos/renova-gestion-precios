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

	const [newMarginsCostList, setNewMarginsCostList] = useState({});
	const [newPricesCostList, setNewPricesCostList] = useState({});
	const [generalMarginCostList, setGeneralMarginCostList] = useState(0);

	const [newMarginsReseller, setNewMarginsReseller] = useState({});
	const [newPricesReseller, setNewPricesReseller] = useState({});
	const [generalMarginReseller, setGeneralMarginReseller] = useState(0);

	useEffect(() => {
		console.log("ENTRO AL USE EFFECT");
		setReload();
		const fetchData = async () => {
			if (selectedGroup) {
				// Verifica si hay una agrupación seleccionada
				try {
					const response = await fetch(
						`${process.env.REACT_APP_API_URL}/api/articles/articles?agrupation=${selectedGroup}`
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
		const createPayload = (data, newMargins, newPrices, priceIndex) => ({
			articles: data.map((item) => ({
				articleId: item.articleId,
				description: item.description,
				netCost: item.netCost,
				grossCost: item.netCost,
				margin: newMargins[item.articleId] || 0,
				netPrice:
					newPrices[item.articleId] ||
					item.netCost * (1 + (item?.prices[priceIndex]?.margin || 0) / 100),
			})),
		});

		const updateList = async (listId, payload, listName) => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_API_URL}/api/articles/updateList?list_id=${listId}`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					}
				);
				if (!response.ok)
					throw new Error(`Error al guardar los datos de ${listName}`);
				const result = await response.json();
				notification.success({
					message: `Lista ${listName} actualizada`,
					description: result.message,
					duration: 2, // Duration in seconds
					stack: false,
				});
			} catch (error) {
				console.error(`Error al enviar los datos de ${listName}:`, error);
			}
		};

		const payload = createPayload(data, newMargins, newPrices, 2);
		const payloadRBC = createPayload(data, newMarginsRBC, newPricesRBC, 3);
		const payloadCostList = createPayload(
			data,
			newMarginsCostList,
			newPricesCostList,
			0
		);
		const payloadReseller = createPayload(
			data,
			newMarginsReseller,
			newPricesReseller,
			1
		);

		await updateList(2, payload, "Normal");
		await updateList(3, payloadRBC, "RBC");
		await updateList(0, payloadCostList, "Cost List");
		await updateList(1, payloadReseller, "Reseller");
		setReload((prev) => !prev);
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
	const applyGeneralMarginCostList = () => {
		const updatedMargins = {};
		const updatedPrices = {};
		data.forEach((record) => {
			const { articleId, netCost } = record;
			updatedMargins[articleId] = generalMarginCostList;
			updatedPrices[articleId] = netCost * (1 + generalMarginCostList / 100);
			handleNewMarginChangeCostList(generalMarginCostList, record);
		});
		setNewMarginsCostList(updatedMargins);
		setNewPricesCostList(updatedPrices);
	};

	const applyGeneralMarginReseller = () => {
		const updatedMargins = {};
		const updatedPrices = {};
		data.forEach((record) => {
			const { articleId, netCost } = record;
			updatedMargins[articleId] = generalMarginReseller;
			updatedPrices[articleId] = netCost * (1 + generalMarginReseller / 100);
			handleNewMarginChangeReseller(generalMarginReseller, record);
		});
		setNewMarginsReseller(updatedMargins);
		setNewPricesReseller(updatedPrices);
	};

	const handleNewMarginChangeCostList = (
		newMargin,
		{ articleId, netCost = 0 }
	) => {
		const newPrice = netCost * (1 + newMargin / 100);
		setNewMarginsCostList((prev) => ({ ...prev, [articleId]: newMargin }));
		setNewPricesCostList((prev) => ({ ...prev, [articleId]: newPrice }));
	};

	const handleNewMarginChangeReseller = (
		newMargin,
		{ articleId, netCost = 0 }
	) => {
		const newPrice = netCost * (1 + newMargin / 100);
		setNewMarginsReseller((prev) => ({ ...prev, [articleId]: newMargin }));
		setNewPricesReseller((prev) => ({ ...prev, [articleId]: newPrice }));
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
				applyGeneralMargin={applyGeneralMargin}
				applyGeneralMarginRBC={applyGeneralMarginRBC}
				applyGeneralMarginCostList={applyGeneralMarginCostList}
				applyGeneralMarginReseller={applyGeneralMarginReseller}
				generalMargin={generalMargin}
				generalMarginRBC={generalMarginRBC}
				generalMarginCostList={generalMarginCostList}
				generalMarginReseller={generalMarginReseller}
				handleNewMarginChange={handleNewMarginChange}
				handleNewMarginChangeRBC={handleNewMarginChangeRBC}
				handleNewMarginChangeCostList={handleNewMarginChangeCostList}
				handleNewMarginChangeReseller={handleNewMarginChangeReseller}
				newMargins={newMargins}
				newMarginsRBC={newMarginsRBC}
				newMarginsCostList={newMarginsCostList}
				newMarginsReseller={newMarginsReseller}
				newPrices={newPrices}
				newPricesRBC={newPricesRBC}
				newPricesCostList={newPricesCostList}
				newPricesReseller={newPricesReseller}
				setGeneralMargin={setGeneralMargin}
				setGeneralMarginRBC={setGeneralMarginRBC}
				setGeneralMarginCostList={setGeneralMarginCostList}
				setGeneralMarginReseller={setGeneralMarginReseller}
				setNewMargins={setNewMargins}
				setNewMarginsRBC={setNewMarginsRBC}
				setNewMarginsCostList={setNewMarginsCostList}
				setNewMarginsReseller={setNewMarginsReseller}
				showWithIVA={showWithIVA}
			/>
		</>
	);
};

export default IndexPage;
