import React from "react";
import { Table } from "antd";
import { formatearNumero } from "../../../utils";

import PriceTable_Normal from "./components/PriceTable_Normal";

const CustomTable = ({
	data,
	showWithIVA,
	applyGeneralMargin,
	generalMargin,
	setGeneralMargin,
	newMargins,
	setNewMargins,
	handleNewMarginChange,
	newPrices,
	applyGeneralMarginRBC,
	generalMarginRBC,
	setGeneralMarginRBC,
	newMarginsRBC,
	setNewMarginsRBC,
	handleNewMarginChangeRBC,
	newPricesRBC,
	applyGeneralMarginCostList,
	generalMarginCostList,
	setGeneralMarginCostList,
	newMarginsCostList,
	setNewMarginsCostList,
	handleNewMarginChangeCostList,
	newPricesCostList,
	applyGeneralMarginReseller,
	generalMarginReseller,
	setGeneralMarginReseller,
	newMarginsReseller,
	setNewMarginsReseller,
	handleNewMarginChangeReseller,
	newPricesReseller,
	searchText,
	showVariation,
}) => {
	const filteredData = data.filter((item) =>
		searchText.length >= 3
			? item.articleId
					.toString()
					.toLowerCase()
					.includes(searchText.toLowerCase()) ||
			  item.description
					.toString()
					.toLowerCase()
					.includes(searchText.toLowerCase())
			: true
	);

	const columns = [
		{
			title: "ARTICULO",
			width: "1%",
			children: [
				{
					title: "CODIGO",
					dataIndex: "articleId",
					key: "articleId",
					align: "left",
					width: "10%",
				},
				{
					title: "DESCRIPCIÓN",
					dataIndex: "description",
					key: "description",
					align: "left",
					width: "10%",
					ellipsis: true,
				},
				{
					title: "COSTO NETO",
					children: [
						{
							title: "Costo RP",
							dataIndex: "netCost",
							key: "netCost",
							align: "right",
							width: "5%",
							render: (text, record) =>
								formatearNumero(record.netCost, showWithIVA),
						},
					],
				},
			],
		},

		// Columnas de COSTO

		// Columnas de LISTA NORMAL
		...PriceTable_Normal({
			name: "LISTA 0",
			applyGeneralMargin: applyGeneralMarginCostList,
			generalMargin: generalMarginCostList,
			setGeneralMargin: setGeneralMarginCostList,
			newMargins: newMarginsCostList,
			setNewMargins: setNewMarginsCostList,
			handleNewMarginChange: handleNewMarginChangeCostList,
			newPrices: newPricesCostList,
			showWithIVA,
			listId: 0,
			showVariation,
		}),
		...PriceTable_Normal({
			name: "LISTA 1",
			applyGeneralMargin: applyGeneralMarginReseller,
			generalMargin: generalMarginReseller,
			setGeneralMargin: setGeneralMarginReseller,
			newMargins: newMarginsReseller,
			setNewMargins: setNewMarginsReseller,
			handleNewMarginChange: handleNewMarginChangeReseller,
			newPrices: newPricesReseller,
			showWithIVA,
			listId: 1,
			showVariation,
		}),
		...PriceTable_Normal({
			name: "LISTA NORMAL",
			applyGeneralMargin,
			generalMargin,
			setGeneralMargin,
			newMargins,
			setNewMargins,
			handleNewMarginChange,
			newPrices,
			showWithIVA,
			listId: 2,
			showVariation,
		}),
		...PriceTable_Normal({
			name: "LISTA RBC",
			applyGeneralMargin: applyGeneralMarginRBC,
			generalMargin: generalMarginRBC,
			setGeneralMargin: setGeneralMarginRBC,
			newMargins: newMarginsRBC,
			setNewMargins: setNewMarginsRBC,
			handleNewMarginChange: handleNewMarginChangeRBC,
			newPrices: newPricesRBC,
			showWithIVA,
			listId: 3,
			showVariation,
		}),
	];

	return (
		<Table
			className="table-custom"
			bordered
			columns={columns}
			dataSource={filteredData}
			rowKey="articleId"
			pagination={{ pageSize: 200 }}
		/>
	);
};

export default CustomTable;
