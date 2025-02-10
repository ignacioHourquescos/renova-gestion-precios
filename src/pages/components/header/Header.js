import React from "react";
import { Modal, Button, Select, Switch, Input } from "antd";
import { groups } from "../utils/dummy_agrupation"; // Ajusta la ruta según la ubicación real
import { groups_prod } from "../utils/dummy_agrupation";
import { Title, Container } from "./styles";
import { createStyles, useTheme } from "antd-style";

const { Option } = Select;

const useStyle = createStyles(({ token }) => ({
	"my-modal-mask": {
		backdropFilter: "blur(10px)",
	},
	"my-modal-content": {
		boxShadow: "0 0 30px rgba(0,0,0,0.1)",
	},
}));

const Header = ({
	isModalVisible,
	handleModalClose,
	setModificationType,
	selectedGroup,
	handleGroupChange,
	showWithIVA,
	handleSwitchChange,
	handleSave,
	setSearchText,
	showVariation,
	handleVariationSwitchChange,
	modificationType,
	isUpdating,
}) => {
	const { styles } = useStyle();
	const token = useTheme();

	const groupsToUse =
		process.env.NODE_ENV === "development" ? groups : groups_prod;

	const modalStyles = {
		mask: {
			backdropFilter: "blur(10px)",
		},
		content: {
			boxShadow: "0 0 30px #999",
		},
	};

	const classNames = {
		mask: styles["my-modal-mask"],
		content: styles["my-modal-content"],
	};

	return (
		<>
			<Container>
				<h2 style={{ margin: "0", padding: "0" }}>GESTOR DE PRECIOS</h2>
				<div>
					{/* add datbase name here PROCESS:ENV. */}
					<Input
						placeholder="Buscar por Código"
						style={{ width: 300 }}
						size="large" // Estilo del input
						onChange={(e) => setSearchText(e.target.value)} // Lógica de búsqueda
					/>{" "}
					<Select
						defaultValue={selectedGroup}
						style={{ width: 300 }}
						size="large"
						onChange={handleGroupChange}
						placeholder="Seleccion agrupación"
					>
						{groupsToUse.map((group) => (
							<Option key={group.code} value={group.code}>
								{group.description}
							</Option>
						))}
					</Select>
				</div>
				<div>
					<span style={{ marginLeft: 8, marginRight: 16 }}>
						Mostrar variaciones
					</span>
					<Switch
						checked={showVariation}
						onChange={handleVariationSwitchChange}
					/>{" "}
					<span style={{ marginLeft: 0 }}>Precios con IVA</span>
					<Switch checked={showWithIVA} onChange={handleSwitchChange} />
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					{/*<Button
						type="primary"
						onClick={handleSave}
						disabled={modificationType !== "COST_MODIFICATION"}
						style={{ flex: 1, marginRight: "8px" }}
					>
						Guardar COSTOS Actualizados
					</Button>*/}

					<Button
						type="primary"
						onClick={handleSave}
						disabled={modificationType !== "PRICE_MODIFICATION"}
						style={{ flex: 1, marginLeft: "8px" }}
						loading={isUpdating}
						size="large"
					>
						{isUpdating ? "Actualizando..." : "Guardar Precios"}
					</Button>
				</div>
			</Container>

			<Modal
				visible={isModalVisible}
				onCancel={() => {}}
				footer={null}
				width="70vw" // Added this line to make modal 70% of viewport width
				styles={modalStyles}
				classNames={classNames}
				style={{
					maxWidth: "1400px", // Optional: adds a maximum width
					minWidth: "800px", // Optional: adds a minimum width
				}}
			>
				<Title>Seleccionar Agrupacion de articulos</Title>

				{/*	<Select
					defaultValue={selectedGroup}
					onChange={handleGroupChange}
					placeholder="Seleccion agrupación"
					style={{ width: "100%", marginBottom: 16 }} // Cambiado a 100%
					showSearch
					filterOption={(input, option) =>
						option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
				>
					{groupsToUse.map((group) => (
						<Option key={group.code} value={group.code}>
							{group.description}
						</Option>
					))}
				</Select>*/}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(5, 1fr)",
						gap: "16px",
						padding: "16px",
					}}
				>
					{groupsToUse.map((group) => (
						<div
							key={group.code}
							onClick={() => {
								handleGroupChange(group.code);
							}}
							style={{
								padding: "20px",
								border:
									group.code === selectedGroup
										? "3px solid #1890ff" // Blue border when selected
										: "1px solid #e8e8e8", // Default border
								borderRadius: "8px",
								textAlign: "center",
								cursor: "pointer",
								backgroundColor: "white",
								boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
								transition: "all 0.2s",
								":hover": {
									transform: "translateY(-2px)",
									boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
								},
							}}
						>
							{group.description}
						</div>
					))}
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: "16px",
					}}
				>
					{/*<Button
						onClick={() => {
							handleModalClose();
							setModificationType("COST_MODIFICATION");
						}}
						type="primary"
						style={{ flex: 1, marginRight: "8px" }}
					>
						Modificar Costos
					</Button>*/}

					<Button
						type="primary"
						onClick={() => {
							handleModalClose();
							setModificationType("PRICE_MODIFICATION");
						}}
						style={{ flex: 1, marginLeft: "8px" }}
					>
						Modificar Precios
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default Header;
