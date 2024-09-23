import React from "react";
import { Modal, Button, Select, Switch, Input } from "antd";
import { groups } from "../utils/dummy_agrupation"; // Ajusta la ruta según la ubicación real
import Title from "./styles";

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
}) => {
	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 16,
				}}
			>
				<div>
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
						{groups.map((group) => (
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

				<Button type="primary" onClick={handleSave}>
					Guardar
				</Button>
			</div>

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
					{groups.map((group) => (
						<Option key={group.code} value={group.code}>
							{group.description}
						</Option>
					))}
				</Select>
				<Option value="" disabled>
					Agrupacion
				</Option>

				<Button
					type="primary"
					onClick={() => {
						handleModalClose();
						setModificationType("manual");
					}}
					block
				>
					OK
				</Button>
			</Modal>
		</>
	);
};

export default Header;
