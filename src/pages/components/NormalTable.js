import React from "react";
import { Table, Spin } from "antd";
import NormalList from "./NormalTable/NormalList"; // Importar el nuevo componente NormalTableColumns
import { formatearNumero, variationFormatter } from "../../utils";
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
}) => {
	const columns = [
		{
			title: "CÓDIGO",
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
			width: "30%",
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
						showWithIVA
							? formatearNumero(record.netCost * 1.21)
							: formatearNumero(record.netCost),
				},
				{
					title: "NUEVO",
					dataIndex: "importedNetCost",
					key: "importedNetCost",
					align: "right",
					width: "5%",
					render: (text) =>
						loading ? (
							<Spin size="small" />
						) : text !== null ? (
							showWithIVA ? (
								formatearNumero(text * 1.21)
							) : (
								formatearNumero(text)
							)
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
		...NormalList({
			applyGeneralMargin,
			generalMargin,
			setGeneralMargin,
			newMargins,
			setNewMargins,
			handleNewMarginChange,
			modificationType,
			newPrices,
		}),
	];

	return (
		<Table
			bordered
			columns={columns}
			dataSource={data}
			rowKey="articleId"
			pagination={{ pageSize: 200 }}
		/>
	);
};

export default CustomTable;
