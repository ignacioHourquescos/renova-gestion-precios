import React, { useState } from "react";
import { InputNumber } from "antd";
import { formatearNumero, variationFormatter } from "../../../../utils";
import ThunderInput from "./componentes/ThunderInput";

const PriceTable_Normal = ({
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
	const [discount, setDiscount] = useState(0);
	return [
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>LISTA NORMAL</h3>,
			children: [
				{
					title: (
						<>
							{" "}
							<div>%GANANCIA</div>
							<div style={{ display: "flex" }}>
								<ThunderInput
									onClick={applyGeneralMargin}
									value={generalMargin}
									onChange={setGeneralMargin}
								/>
							</div>
						</>
					),
					dataIndex: "newMargin",
					key: "newMargin",
					align: "right",
					width: "3%",
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
								precision={2}
								step={0.01}
								className="percentaje"
							/>
						);
					},
				},
				{
					title: (
						<>
							{" "}
							<div>NUEVO</div>
							<div style={{ display: "flex", alignItems: "center" }}>
								<InputNumber
									type="number"
									style={{ marginLeft: 8, width: 100 }}
									placeholder="Descuento %"
									onChange={(value) => setDiscount(value || 0)} // Asumiendo que tienes un estado para el descuento
									suffix="%"
									precision={2}
									step={0.01}
								/>
							</div>
						</>
					),
					dataIndex: "newPrice",
					key: "newPrice",
					align: "right",
					width: "3%",
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
											100) *
								  (1 - discount / 100);
						return (
							<div>
								<> {formatearNumero(newPrice, showWithIVA)}</>
							</div>
						);
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

export default PriceTable_Normal;
