import * as XLSX from "xlsx"; // Asegúrate de importar la biblioteca xlsx

export const handleImportExcel = (e, setLoading, setImportedData) => {
	if (e.target.files.length === 0) {
		console.error("No file selected");
		return;
	}

	const file = e.target.files[0];
	const reader = new FileReader();
	reader.onload = (event) => {
		setLoading(true); // Iniciar carga
		const data = new Uint8Array(event.target.result);
		const workbook = XLSX.read(data, { type: "array" });
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];
		const jsonData = XLSX.utils.sheet_to_json(worksheet);

		// Limpiar datos importados anteriores
		setImportedData([]); // Limpiar datos anteriores
		setTimeout(() => {
			setImportedData(jsonData); // Guardar datos importados
			setLoading(false); // Finalizar carga
		}, 0); // Retraso de 1 segundo
	};
	reader.readAsArrayBuffer(file);
};
