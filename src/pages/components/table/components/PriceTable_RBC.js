import React from "react";
import { Button, InputNumber, Spin } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { formatearNumero, variationFormatter } from "../../../../utils";

const PriceTable_RBC = ({
	loading,
	showWithIVA,
	applyGeneralMarginRBC,
	generalMarginRBC,
	setGeneralMarginRBC,
	newMarginsRBC,
	setNewMarginsRBC,
	handleNewMarginChangeRBC,
	modificationType,
	newPricesRBC,
}) => {
	return [
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>LISTA RBC</h3>,
			children: [
				{
					title: (
						<div style={{ display: "flex" }}>
							<Button
								icon={<ThunderboltOutlined />}
								onClick={applyGeneralMarginRBC}
								style={{ width: "50px" }}
							/>
							<InputNumber
								style={{ marginLeft: 8, width: 50 }}
								value={generalMarginRBC}
								onChange={setGeneralMarginRBC}
								suffix="%"
								className="percentaje"
							/>
						</div>
					),
					dataIndex: "newMarginRBC",
					key: "newMarginRBC",
					align: "right",
					width: "3%",
					render: (value, record) => {
						const initialMargin = record.prices[0]?.margin;
						if (!(record.articleId in newMarginsRBC)) {
							setNewMarginsRBC((prev) => ({
								...prev,
								[record.articleId]: initialMargin,
							}));
						}
						return (
							<InputNumber
								type="number"
								value={newMarginsRBC[record.articleId] || initialMargin}
								onChange={(value) => handleNewMarginChangeRBC(value, record)}
								style={{ width: "100%" }}
								suffix="%"
								className="percentaje"
							/>
						);
					},
				},
				{
					title: "NUEVO",
					dataIndex: "newPriceRBC",
					key: "newPriceRBC",
					align: "right",
					width: "3%",
					render: (_, record) => {
						const newPrice =
							modificationType === "massive"
								? newPricesRBC[record.articleId] ||
								  record.importedNetCost *
										(1 +
											(newMarginsRBC[record.articleId] ||
												record.prices[0]?.margin) /
												100)
								: record.netCost *
								  (1 +
										(newMarginsRBC[record.articleId] ||
											record.prices[0]?.margin) /
											100);
						return (
							<div>
								<>{formatearNumero(newPrice, showWithIVA)}</>
							</div>
						);
					},
				},
				{
					title: "△",
					dataIndex: "newVariationRBC",
					key: "newVariationRBC",
					align: "center",
					width: "3%",
					render: (_, record) => {
						const value =
							modificationType === "massive"
								? newPricesRBC[record.articleId] / record.prices[0].netPrice
								: (record.netCost *
										(1 +
											(newMarginsRBC[record.articleId] ||
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

export default PriceTable_RBC;
