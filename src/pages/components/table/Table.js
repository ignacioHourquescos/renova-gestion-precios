import React from "react";
import { Input, InputNumber, Table } from "antd";
import { formatearNumero } from "../../../utils";
import "./Spinner.css";

import PriceTable_Normal from "./components/PriceTable_Normal";
import { TableContainer } from "./Table.styles";

const CustomSpinner = () => (
	<div class="spinner">
		<div class="bounce1"></div>
		<div class="bounce2"></div>
		<div class="bounce3"></div>
	</div>
);

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
	loading,
}) => {
	const filteredData = React.useMemo(() => {
		if (!data || !Array.isArray(data)) return [];

		return data.filter((item) =>
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
	}, [data, searchText]);

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
								<InputNumber
									value={modifiedNetCosts[record.articleId] || record.netCost}
									disabled={modificationType != "COST_MODIFICATION"}
									onChange={(e) =>
										handleNetCostChange(
											record.articleId,
											parseFloat(e.target.value)
										)
									}
									style={{ fontWeight: "bold" }}
									formatter={(value) =>
										value !== null && value !== undefined
											? `$ ${Math.round(value)
													.toString()
													.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
											: ""
									}
									parser={(value) => {
										const parsed = value
											.replace(/[$\s.]/g, "")
											.replace(",", ".");
										return parsed === "" ? null : Number(parsed);
									}}
								/>
							),
						},
					],
				},
			],
		},

		// Columnas de COSTO

		...PriceTable_Normal({
			name: "LISTA 1",
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
			data: filteredData,
		}),
		...PriceTable_Normal({
			name: "LISTA 2",
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
			data: filteredData,
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
			data: filteredData,
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
			data: filteredData,
		}),
	];

	const tableLoading = {
		spinning: loading,
		indicator: <CustomSpinner />,
	};

	return (
		<TableContainer>
			<Table
				className="table-custom"
				columns={columns}
				dataSource={filteredData}
				rowKey="articleId"
				scroll={{ y: "75vh" }} // Enable vertical scrolling
				sticky={true}
				pagination={{
					defaultPageSize: 100,
					position: ["bottomCenter"],
					size: "small",
				}}
				loading={tableLoading}
			/>
		</TableContainer>
	);
};

export default CustomTable;
