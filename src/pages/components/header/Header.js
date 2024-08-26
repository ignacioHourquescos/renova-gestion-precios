import React from "react";
import { Modal, Button, Select, Switch } from "antd";
import { groups } from "../utils/dummy_agrupation"; // Ajusta la ruta según la ubicación real

const { Option } = Select;

const Header = ({
	isModalVisible,
	handleModalClose,
	setModificationType,
	selectedGroup,
	handleGroupChange,
	handleImportExcel,
	showWithIVA,
	handleSwitchChange,
	handleSave,
}) => {
	return (
		<>
			<Modal
				title="Seleccione una opción"
				visible={isModalVisible}
				onCancel={handleModalClose}
				footer={null}
			>
				<Button
					type="primary"
					onClick={() => {
						handleModalClose();
						setModificationType("manual");
					}}
					block
				>
					Modificación Manual
				</Button>
				<Button
					type="default"
					onClick={() => {
						handleModalClose();
						setModificationType("massive");
					}}
					block
					style={{ marginTop: "10px" }}
				>
					Subida de lista de precios
				</Button>
			</Modal>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 16,
				}}
			>
				<input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} />
				<Select
					defaultValue={selectedGroup}
					style={{ width: 200, marginBottom: 16 }}
					onChange={handleGroupChange}
				>
					{groups.map((group) => (
						<Option key={group.code} value={group.code}>
							{group.description}
						</Option>
					))}
				</Select>
				<>
					<span style={{ margin: "0px" }}>Precios sin IVA</span>
					<Switch checked={showWithIVA} onChange={handleSwitchChange} />
					<span style={{ marginLeft: 0 }}>Precios con IVA</span>
				</>
				<Button type="primary" onClick={handleSave}>
					Guardar
				</Button>
			</div>
		</>
	);
};

export default Header;
