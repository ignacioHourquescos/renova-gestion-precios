import React, { useState } from "react";
import { Table, Spin, Input } from "antd";
import { formatearNumero, variationFormatter } from "../../../utils";
import NormalList from "./components/PriceTable_RBC";
import PriceTable_Normal from "./components/PriceTable_Normal";
import PriceTable_RBC from "./components/PriceTable_RBC";

const CustomTable = ({
	data,
	loading,
	showWithIVA,
	applyGeneralMargin,
	generalMargin,
	setGeneralMargin,
	newMargins,
	setNewMargins,
	handleNewMarginChange,
	modificationType,
	newPrices,
	applyGeneralMarginRBC,
	generalMarginRBC,
	setGeneralMarginRBC,
	newMarginsRBC,
	setNewMarginsRBC,
	handleNewMarginChangeRBC,
	newPricesRBC,
	searchText,
	setSearchText,
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
			width: "5%",
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
			],
		},

		// Columnas de COSTO
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
							formatearNumero(text, showWithIVA)
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
						const { importedNetCost, netCost, grossCost } = record;
						if (importedNetCost === null || netCost === null) return "-";
						const value = importedNetCost / grossCost;
						return variationFormatter(value);
					},
				},
			],
		},
		// Columnas de LISTA NORMAL
		...PriceTable_Normal({
			applyGeneralMargin,
			generalMargin,
			setGeneralMargin,
			newMargins,
			setNewMargins,
			handleNewMarginChange,
			newPrices,
			modificationType,
			showWithIVA,
		}),
		...PriceTable_RBC({
			applyGeneralMarginRBC, //especifico de lista
			generalMarginRBC, //especifico de lista
			setGeneralMarginRBC, //especifico de lista
			newMarginsRBC, //especifico de lista
			setNewMarginsRBC, //especifico de lista
			handleNewMarginChangeRBC, //especifico de lista
			newPricesRBC, //especifico de lista
			modificationType,
			showWithIVA,
		}),
		//...PriceTable_RBC({
		//	applyGeneralMarginRBC, //especifico de lista
		//	generalMarginRBC, //especifico de lista
		//	setGeneralMarginRBC, //especifico de lista
		//	newMarginsRBC, //especifico de lista
		//	setNewMarginsRBC, //especifico de lista
		//	handleNewMarginChangeRBC, //especifico de lista
		//	newPricesRBC, //especifico de lista
		//	modificationType,
		//	showWithIVA,
		//}),
		//...PriceTable_RBC({
		//	applyGeneralMarginRBC, //especifico de lista
		//	generalMarginRBC, //especifico de lista
		//	setGeneralMarginRBC, //especifico de lista
		//	newMarginsRBC, //especifico de lista
		//	setNewMarginsRBC, //especifico de lista
		//	handleNewMarginChangeRBC, //especifico de lista
		//	newPricesRBC, //especifico de lista
		//	modificationType,
		//	showWithIVA,
		//}),
	];

	return (
		<Table
			class="table-custom"
			bordered
			columns={columns}
			dataSource={filteredData} // Usa los datos filtrados
			rowKey="articleId"
			pagination={{ pageSize: 200 }}
		/>
	);
};

export default CustomTable;
