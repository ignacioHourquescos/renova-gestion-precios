import React from "react";
import { Input, InputNumber, Table } from "antd";
import { formatearNumero } from "../../../utils";
import "./Spinner.css";
import * as XLSX from "xlsx";

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
					title: (
						<h3
							style={{
								margin: "0",
								padding: "0",
								cursor: "pointer",
								"&:hover": {
									textDecoration: "underline",
								},
							}}
							onClick={() => handleCostExport()}
						>
							<div
								style={{
									border: "1px solid black",
									padding: "0.2rem",
									margin: "0 0.3rem",
									borderRadius: "50px",
									textAlign: "center",
								}}
							>
								COSTO NETO
							</div>
						</h3>
					),
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

	const handleCostExport = () => {
		if (!data || !Array.isArray(data)) {
			console.warn("No data available for export");
			return;
		}

		const excelData = filteredData.map((item) => {
			const costoSinIVA = modifiedNetCosts[item.articleId] || item.netCost;
			const costoConIVA = costoSinIVA * 1.21;

			return {
				Código: item.articleId,
				Descripción: item.description,
				"Costo sin IVA": Number(costoSinIVA).toFixed(2),
				"Costo con IVA": Number(costoConIVA).toFixed(2),
			};
		});

		try {
			const wb = XLSX.utils.book_new();
			const ws = XLSX.utils.json_to_sheet(excelData);

			// Definir los anchos de columna
			const colWidths = [
				{ wch: 15 }, // Código
				{ wch: 40 }, // Descripción
				{ wch: 15 }, // Costo sin IVA
				{ wch: 15 }, // Costo con IVA
			];
			ws["!cols"] = colWidths;

			// Aplicar estilos a las columnas
			const range = XLSX.utils.decode_range(ws["!ref"]);
			for (let C = 0; C <= range.e.c; C++) {
				for (let R = 0; R <= range.e.r; R++) {
					const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
					if (!ws[cellRef]) continue;

					// Alinear a la derecha las columnas numéricas (Costos)
					if (C >= 2) {
						// Las columnas 3 y 4 (índice 2, 3)
						ws[cellRef].z = "#,##0.00"; // Formato numérico con 2 decimales
						if (!ws[cellRef].s) ws[cellRef].s = {};
						ws[cellRef].s.alignment = { horizontal: "right" };
					}
				}
			}

			// Estilos para la fila de encabezado
			const headerStyle = {
				font: { bold: true },
				alignment: { horizontal: "center" },
				fill: { fgColor: { rgb: "EEEEEE" } },
			};

			// Aplicar estilos al encabezado
			for (let C = 0; C <= range.e.c; C++) {
				const headerRef = XLSX.utils.encode_cell({ r: 0, c: C });
				if (!ws[headerRef].s) ws[headerRef].s = {};
				Object.assign(ws[headerRef].s, headerStyle);
			}

			XLSX.utils.book_append_sheet(wb, ws, "Costos");
			XLSX.writeFile(
				wb,
				`Lista_Costos_${new Date().toISOString().split("T")[0]}.xlsx`
			);
		} catch (error) {
			console.error("Error generating Excel file:", error);
		}
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
					defaultPageSize: 50,
					position: ["bottomCenter"],
					size: "small",
				}}
				loading={tableLoading}
			/>
		</TableContainer>
	);
};

export default CustomTable;
