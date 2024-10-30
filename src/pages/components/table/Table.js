import React from "react";
import { Input, Table } from "antd";
import { formatearNumero } from "../../../utils";

import PriceTable_Normal from "./components/PriceTable_Normal";
import { TableContainer } from "./Table.styles";

const CustomTable = ({
	data,
	modifiedNetCosts,
	modificationType,
	handleNetCostChange,
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
	handleNewPriceChangeCostList,
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
					width: "5%",
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
							dataIndex: "netCost",
							key: "netCost",
							align: "right",
							width: "3%",
							render: (text, record) => (
								<Input
									value={modifiedNetCosts[record.articleId] || record.netCost}
									disabled={modificationType != "COST_MODIFICATION"}
									onChange={(e) =>
										handleNetCostChange(
											record.articleId,
											parseFloat(e.target.value)
										)
									}
								/>
							),
						},
					],
				},
			],
		},

		// Columnas de COSTO

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
			modificationType,
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
			modificationType,
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
			modificationType,
		}),

		...PriceTable_Normal({
			name: "RBC",
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
			modificationType,
		}),
	];

	return (
		<TableContainer>
			<Table
				className="table-custom"
				columns={columns}
				dataSource={filteredData}
				rowKey="articleId"
				pagination={false}
				scroll={{ y: "75vh" }} // Enable vertical scrolling
				sticky={true}
			/>
		</TableContainer>
	);
};

export default CustomTable;
