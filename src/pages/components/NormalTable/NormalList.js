import React from "react";
import { Button, InputNumber, Spin } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { formatearNumero, variationFormatter } from "../../../utils";

const NormalList = ({
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
	return [
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
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>LISTA NORMAL</h3>,
			children: [
				{
					title: (
						<div style={{ display: "flex" }}>
							<Button
								icon={<ThunderboltOutlined />}
								onClick={applyGeneralMargin}
								style={{ width: "50px" }}
							/>
							<InputNumber
								style={{ marginLeft: 8, width: 100 }}
								value={generalMargin}
								onChange={setGeneralMargin}
								suffix="%"
								className="percentaje"
							/>
						</div>
					),
					dataIndex: "newMargin",
					key: "newMargin",
					align: "right",
					width: "5%",
					render: (value, record) => {
						const initialMargin = record.prices[0]?.margin;
						if (!(record.articleId in newMargins)) {
							setNewMargins((prev) => ({
								...prev,
								[record.articleId]: initialMargin,
							}));
						}
						return (
							<InputNumber
								type="number"
								value={newMargins[record.articleId] || initialMargin}
								onChange={(value) => handleNewMarginChange(value, record)}
								style={{ width: "100%" }}
								suffix="%"
								className="percentaje"
							/>
						);
					},
				},
				{
					title: "NUEVO",
					dataIndex: "newPrice",
					key: "newPrice",
					align: "right",
					width: "5%",
					render: (_, record) => {
						const newPrice =
							modificationType === "massive"
								? newPrices[record.articleId] ||
								  record.importedNetCost *
										(1 +
											(newMargins[record.articleId] ||
												record.prices[0]?.margin) /
												100)
								: record.netCost *
								  (1 +
										(newMargins[record.articleId] || record.prices[0]?.margin) /
											100);
						return <div>new - {newPrice.toFixed(0)}</div>;
					},
				},
				{
					title: "△",
					dataIndex: "newVariation",
					key: "newVariation",
					align: "center",
					width: "3%",
					render: (_, record) => {
						const value =
							modificationType === "massive"
								? newPrices[record.articleId] / record.prices[0].netPrice
								: (record.netCost *
										(1 +
											(newMargins[record.articleId] ||
												record.prices[0]?.margin) /
												100)) /
								  record.prices[0].netPrice;

						return <>{variationFormatter(value)}</>;
					},
				},
			],
		},
	];
};

export default NormalList;
