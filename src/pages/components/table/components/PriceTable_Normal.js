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
	listId,
	showVariation,
	modificationType,

	handleNewPriceChangeCostList,
}) => {
	const [discount, setDiscount] = useState(0);
	const isDisabled = modificationType === "COST_MODIFICATION";
	const [fixedTarget, setFixedTarget] = useState(null);

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
							<div>GANANCIA</div>
							<div style={{ display: "flex" }}>
								<ThunderInput
									onClick={(listId) => applyGeneralMargin(listId)}
									value={generalMargin}
									onChange={setGeneralMargin}
									disabled={isDisabled}
								/>
							</div>
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
								type="number"
								value={newMargins[record.articleId] || initialMargin}
								onChange={(value) => handleNewMarginChange(value, record)}
								style={{ width: "100%" }}
								suffix="%"
								precision={2}
								step={0.01}
								className="percentaje"
								disabled={isDisabled}
							/>
						);
					},
				},
				!showVariation
					? {
							title: (
								<>
									{" "}
									<div>PRECIO</div>
									<div style={{ display: "flex", alignItems: "center" }}>
										<InputNumber
											type="number"
											style={{ paddingLeft: 2, width: 100 }}
											placeholder="Descuento %"
											onChange={(value) => setDiscount(value || 0)} // Asumiendo que tienes un estado para el descuento
											suffix="%"
											precision={2}
											step={0.01}
											disabled={isDisabled}
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
								const priceInfo = findPriceByListId(record.prices, listId);
								const initialPrice = priceInfo.price;
								const newPrice =
									record.netCost *
									(1 +
										(newMargins[record.articleId] || priceInfo.margin) / 100) *
									(1 - discount / 100);
								//console.log("NEWMARGINS", newMargins, "PRICEINFO", priceInfo);
								return (
									<div>
										{/* <div>RP:{priceInfo.margin}</div> */}
										{/* <div>NEW:{newMargins[record.articleId]}</div> */}

										<InputNumber
											type="number"
											value={newPrice || initialPrice}
											onChange={(value) =>
												handleNewPriceChangeCostList(value, record)
											}
											style={{ width: "100%" }}
											disabled={isDisabled}
										/>
										{/* <div>
											{isNaN(newPrice)
												? "NO existe"
												: formatearNumero(newPrice, showWithIVA)}
										</div> */}
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
										<div>
											{/* <div>RP:{priceInfo.netPrice}</div> */}
											{/* <div>
    NEW:
    {record.netCost *
        (1 +
            (newMargins[record.articleId] || priceInfo.margin) /
                100)}
</div> */}
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
