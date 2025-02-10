import React, { useState } from "react";
import { Button, InputNumber } from "antd";
import { formatearNumero, variationFormatter } from "../../../../utils";
import ThunderInput from "./componentes/ThunderInput";
import { ThunderboltOutlined } from "@ant-design/icons";

const PriceTable_Normal = ({
	name,
	showWithIVA,
	applyGeneralMargin,
	generalMargin,
	setGeneralMargin,
	newMargins,
	setNewMargins,
	handleNewMarginChange,
	listId,
	showVariation,
	modificationType,
}) => {
	const [discount, setDiscount] = useState(0);
	const isDisabled = modificationType === "COST_MODIFICATION";

	const findPriceByListId = (prices, targetListId) => {
		const dummyPriceRecord = {
			listId: 0,
			netPrice: 0,
			margin: 0,
		};
		return (
			prices.find((price) => price.listId === targetListId) || {
				dummyPriceRecord,
			}
		);
	};
	return [
		{
			title: <h3 style={{ margin: "0", padding: "0" }}>{name}</h3>,
			children: [
				{
					title: (
						<>
							<div style={{ position: "relative" }}>
								{" "}
								<div
									style={{
										position: "absolute",
										top: "5px",
										left: "5px",
										zIndex: "100",
									}}
								>
									{" "}
									<Button
										type="primary"
										icon={<ThunderboltOutlined />} // Fixed icon
										onClick={(listId) => applyGeneralMargin(listId)}
										disabled={isDisabled}
									/>
								</div>
								GANANCIA
							</div>
							<ThunderInput
								onClick={(listId) => applyGeneralMargin(listId)}
								value={generalMargin}
								onChange={setGeneralMargin}
								disabled={isDisabled}
							/>
						</>
					),
					dataIndex: "newMargin",
					key: "newMargin",
					align: "right",
					width: "3%",
					render: (value, record) => {
						const priceInfo = findPriceByListId(record.prices, listId);
						const initialMargin = priceInfo.margin;
						if (!(record.articleId in newMargins)) {
							setNewMargins((prev) => ({
								...prev,
								[record.articleId]: initialMargin,
							}));
						}
						return (
							<InputNumber
								suffix="%"
								type="number"
								value={newMargins[record.articleId] ?? initialMargin}
								onChange={(value) =>
									handleNewMarginChange(value !== null ? value : 0, record)
								}
								precision={2}
								step={0.01}
								className="percentaje"
								disabled={isDisabled}
								formatter={(value) =>
									value !== null && value !== undefined
										? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
										: ""
								}
								parser={(value) => {
									const parsed = value.replace(/\$\s?|(,*)/g, "");
									return parsed === "" ? null : Number(parsed);
								}}
							/>
						);
					},
				},
				!showVariation
					? {
							title: (
								<div>
									<div style={{ position: "relative" }}>
										{" "}
										<div
											style={{
												position: "absolute",
												top: "5px",
												left: "5px",
												zIndex: "100",
											}}
										>
											<Button
												type="primary"
												style={{
													background: "transparent",
													boxShadow: "0px !important",
												}}
												icon={
													<ThunderboltOutlined
														style={{
															background: "transparent",
															color: "transparent",
														}}
													/>
												} // Fixed icon
												disabled={isDisabled}
											/>
										</div>
										PRECIO
									</div>
									<InputNumber
										type="number"
										style={{ width: 100 }}
										placeholder="Descuento"
										onChange={(value) => setDiscount(value || 0)} // Asumiendo que tienes un estado para el descuento
										precision={2}
										disabled={isDisabled}
										step={0.01}
									/>
								</div>
							),
							dataIndex: "newPrice",
							key: "newPrice",
							align: "right",
							width: "3%",
							render: (_, record) => {
								const priceInfo = findPriceByListId(record.prices, listId);
								const newPrice =
									record.netCost *
									(1 +
										(newMargins[record.articleId] || priceInfo.margin) / 100) *
									(1 - discount / 100);

								const variation =
									priceInfo.netPrice > 0
										? (record.netCost *
												(1 +
													(newMargins[record.articleId] || priceInfo.margin) /
														100)) /
										  priceInfo.netPrice
										: 1;

								return (
									<div
										style={{
											backgroundColor: isDisabled ? "#f0f0f0" : "white",
											padding: "0 !important",
											margin: "0 !important",
											height: "100%",
											display: "flex",
											alignItems: "center",
											paddingRight: "17px",
											justifyContent: "space-between",
										}}
									>
										{getVariationTriangle(variation)}{" "}
										{isNaN(newPrice) || newPrice === 0
											? "NO existe"
											: formatearNumero(newPrice, showWithIVA)}
									</div>
								);
							},
					  }
					: {
							title: "△",
							dataIndex: "newVariation",
							key: "newVariation",
							align: "right",
							width: "3%",

							render: (_, record) => {
								const priceInfo = findPriceByListId(record.prices, listId);

								const value =
									(record.netCost *
										(1 +
											(newMargins[record.articleId] || priceInfo.margin) /
												100)) /
									priceInfo.netPrice;

								return (
									<div>
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

const getVariationTriangle = (variation) => {
	switch (true) {
		case variation > 1.01:
			return <span style={{ color: "green" }}>▲</span>;
		case variation < 0.99:
			return <span style={{ color: "red" }}>▼</span>;
		default:
			return null;
	}
};
