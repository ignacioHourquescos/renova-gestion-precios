import React, { useState } from "react";
import { InputNumber } from "antd";
import { formatearNumero, variationFormatter } from "../../../../utils";
import ThunderInput from "./componentes/ThunderInput";

const PriceTable_Normal = ({
	name,

	showWithIVA,
	applyGeneralMargin,
	generalMargin,
	setGeneralMargin,
	newMargins,
	setNewMargins,
	handleNewMarginChange,

	index,
}) => {
	const [discount, setDiscount] = useState(0);
	return [
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>{name}</h3>,
			children: [
				{
					title: (
						<>
							<div>%GANANCIA</div>
							<div style={{ display: "flex" }}>
								<ThunderInput
									onClick={(index) => applyGeneralMargin(index)}
									value={generalMargin}
									onChange={setGeneralMargin}
									type="secondary"
								/>
							</div>
						</>
					),
					dataIndex: "newMargin",
					key: "newMargin",
					align: "right",
					width: "3%",
					render: (value, record) => {
						const initialMargin = record.prices[index]?.margin;
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
						//prettier-ignore
						const newPrice =record.netCost *(1 +( record.prices[index]?.margin ||newMargins[record.articleId] ) /100) *(1 - discount / 100);
						return (
							<div>
								<div>RP:{record.prices[index]?.margin}</div>
								<div>NEW:{newMargins[record.articleId]}</div>
								<div> {formatearNumero(newPrice, showWithIVA)}</div>
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
							(record.netCost *
								(1 +
									(newMargins[record.articleId] ||
										record.prices[index]?.margin) /
										100)) /
							record.prices[index].netPrice;

						return (
							<div>
								<div>
									<div>RP:{record.prices[index].netPrice}</div>
									<div>
										NEW:
										{record.netCost *
											(1 +
												(newMargins[record.articleId] ||
													record.prices[index]?.margin) /
													100)}
									</div>
								</div>
								<div>{variationFormatter(value)}</div>
							</div>
						);
					},
				},
			],
		},
	];
};

export default PriceTable_Normal;
