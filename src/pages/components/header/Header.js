import React from "react";
import { Modal, Button, Select, Switch, Input } from "antd";
import { groups } from "../utils/dummy_agrupation"; // Ajusta la ruta según la ubicación real
import { groups_prod } from "../utils/dummy_agrupation";
import { Title, Container } from "./styles";

const { Option } = Select;

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
}) => {
	const groupsToUse =
		process.env.NODE_ENV === "development" ? groups : groups_prod;
	console.log("PROCCESS:ENV", process.env);
	return (
		<>
			<Container>
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
					<Button
						type="primary"
						onClick={handleSave}
						disabled={modificationType !== "COST_MODIFICATION"}
						style={{ flex: 1, marginRight: "8px" }}
					>
						Guardar COSTOS Actualizados
					</Button>

					<Button
						type="primary"
						onClick={handleSave}
						disabled={modificationType !== "PRICE_MODIFICATION"}
						style={{ flex: 1, marginLeft: "8px" }}
					>
						Guardar PRECIOS Modificados
					</Button>
				</div>
			</Container>

			<Modal
				title="MOdificacion de precios"
				visible={isModalVisible}
				onCancel={() => {}}
				footer={null}
			>
				<Title>Seleccionar Agrupacion de articulos</Title>

				<Select
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
				</Select>
				<Option value="" disabled>
					Agrupacion
				</Option>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: "16px",
					}}
				>
					<Button
						onClick={() => {
							handleModalClose();
							setModificationType("COST_MODIFICATION");
						}}
						type="primary"
						style={{ flex: 1, marginRight: "8px" }}
					>
						Modificar Costos
					</Button>

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
