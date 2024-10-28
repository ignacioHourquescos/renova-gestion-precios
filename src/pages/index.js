import React, { useEffect, useState } from "react";
import { notification } from "antd";
import Header from "./components/header/Header";
import CustomTable from "./components/table/Table";

const IndexPage = () => {
	const [data, setData] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState(null); // Cambiar a null para indicar que no hay selección
	const [showWithIVA, setShowWithIVA] = useState(false); // Estado para el Switch
	const [showVariation, setShowVariation] = useState(false);

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
	const [modifiedNetCosts, setModifiedNetCosts] = useState({});

	const handleNetCostChange = (articleId, newNetCost) => {
		setModifiedNetCosts((prev) => ({ ...prev, [articleId]: newNetCost }));
	};

	useEffect(() => {
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
		if (modificationType === "COST_MODIFICATION") {
			const payload = {
				articles: data.map((item) => ({
					articleId: item.articleId,
					grossCost: item.grossCost,
					netCost: modifiedNetCosts[item.articleId] || item.netCost,
				})),
			};

			try {
				const response = await fetch(
					`${process.env.REACT_APP_API_URL}/api/articles/updateCosts`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					}
				);
				if (!response.ok) throw new Error(`Error al actualizar los costos`);
				const result = await response.json();
				notification.success({
					message: `Costos actualizados`,
					description: result.message,
					duration: 2,
					stack: false,
				});
				setReload((prev) => !prev);
				return;
			} catch (error) {
				console.error(`Error al enviar los datos de costos:`, error);
				notification.error({
					message: `Error al actualizar los costos`,
					description: error.message,
					duration: 2,
					stack: false,
				});
				return;
			}
		}
		const createPayload = (data, newMargins, newPrices, priceIndex) => ({
			articles: data.map((item) => {
				console.log("LISTA=>", priceIndex);
				console.log("Article ID:", item.articleId);
				console.log("Description:", item.description);
				console.log(
					"Net Cost:",
					modifiedNetCosts[item.articleId] || item.netCost
				);
				console.log("Gross Cost:", item.netCost);
				console.log("Margin:", newMargins[item.articleId] || 0);
				console.log("newPrices[item.articleId]: =>", newPrices[item.articleId]);
				console.log(
					"item.netCost * (1 + (item?.prices[priceIndex]?.margin || 0) / 100) =>",
					item.netCost * (1 + (item?.prices[priceIndex]?.margin || 0) / 100)
				);
				console.log(
					"item?.prices[priceIndex]?.margin =>",
					item?.prices[priceIndex]?.margin
				);
				console.log("------------------------");

				return {
					articleId: item.articleId,
					description: item.description,
					netCost: modifiedNetCosts[item.articleId] || item.netCost,
					grossCost: item.netCost,
					margin: newMargins[item.articleId] || 0,
					netPrice:
						newPrices[item.articleId] ||
						item.netCost * (1 + (item?.prices[priceIndex]?.margin || 0) / 100),
				};
			}),
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
				if (!response.ok) {
					const errorData = await response.json();
					const errorMessage = errorData.message || "Unknown error occurred";
					notification.error({
						message: "Error",
						description: `${errorMessage}`,
						placement: "topRight",
						duration: 5,
					});
					console.warn(errorMessage);
					throw new Error(`Error al guardar los datos de ${listName}`);
				}

				const result = await response.json();
				notification.success({
					message: `Lista ${listName} actualizada`,
					description: result.message,
					duration: 2, // Duration in seconds
					stack: false,
				});
			} catch (error) {
				let errorMessage = "Error desconocido";

				// Try to parse the error message if it's a JSON string
				try {
					const errorObj = JSON.parse(error.message);
					errorMessage = errorObj.message || errorMessage;
				} catch (e) {
					// If parsing fails, use the error message as is
					errorMessage = error.message || errorMessage;
				}

				console.error(`Error al enviar los datos de ${listName}:`, error);
			}
		};

		//const payload = createPayload(data, newMargins, newPrices, 2);
		const payloadRBC = createPayload(data, newMarginsRBC, newPricesRBC, 3);
		//const payloadCostList = createPayload(
		//	data,
		//	newMarginsCostList,
		//	newPricesCostList,
		//	0
		//);
		//const payloadReseller = createPayload(
		//	data,
		//	newMarginsReseller,
		//	newPricesReseller,
		//	1
		//);

		//await updateList(2, payload, "Normal");
		//await updateList(3, payloadRBC, "RBC");
		//await updateList(0, payloadCostList, "Cost List");
		//await updateList(1, payloadReseller, "Reseller");

		try {
			//await updateList(2, payload, "Normal");
			await updateList(3, payloadRBC, "RBC");
			//await updateList(0, payloadCostList, "Cost List");
			//await updateList(1, payloadReseller, "Reseller");
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Reload the page after the 2-second delay
			//window.location.reload();
		} catch (error) {
			console.error("Error updating list:", error);
			// Handle the error appropriately
		}
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

	const handleNewPriceChangeCostList = (
		newPrice,
		{ articleId, netCost = 0 }
	) => {
		if (netCost <= 0) {
			console.warn("Net cost is zero or negative. Cannot calculate margin.");
			return;
		}

		const newMargin = ((newPrice / netCost - 1) * 100).toFixed(2);
		console.log("NEWMARGIN", newMargin, "NEW PRICE", newPrice);

		setNewPricesCostList((prev) => ({ ...prev, [articleId]: newPrice }));
		setNewMarginsCostList((prev) => ({
			...prev,
			[articleId]: parseFloat(newMargin),
		}));
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
	const handleVariationSwitchChange = (checked) => {
		setShowVariation(checked);
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
				showVariation={showVariation}
				handleVariationSwitchChange={handleVariationSwitchChange}
			/>

			<CustomTable
				showVariation={showVariation}
				loading={loading}
				data={data}
				searchText={searchText}
				modificationType={modificationType}
				modifiedNetCosts={modifiedNetCosts}
				handleNetCostChange={handleNetCostChange}
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
				handleNewPriceChangeCostList={handleNewPriceChangeCostList}
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
