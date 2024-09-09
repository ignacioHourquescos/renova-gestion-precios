import { UpOutlined, DownOutlined } from "@ant-design/icons"; // Importar íconos

export function formatearNumero(num, showWithIVA) {
	if (num === undefined || num === null) {
		return "-"; // O cualquier valor predeterminado que desees
	}
	console.log("numero", num);
	console.log("showWithIVA", showWithIVA);
	// Convierte el número a un string con dos decimales

	// Une las partes con la coma para los decimales
	return (
		<>
			{showWithIVA ? (
				<span style={{ fontWeight: "bold" }}>
					${agregarSeparadorMiles((num * 1.21).toFixed(0))}
				</span>
			) : (
				<span>${agregarSeparadorMiles(num.toFixed(0))}</span>
			)}
		</>
	);
}
function agregarSeparadorMiles(numero) {
	return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function variationFormatter(value) {
	if (isNaN(value)) {
		return <span style={{ color: "gray" }}>0</span>;
	}

	if (((value - 1) * 100).toFixed(2) == 0.0 || isNaN(value)) {
		return <span style={{ color: "gray" }}>0</span>; // Mostrar 0 si el porcentaje es 0
	}
	return (
		<span style={{ color: value > 1 ? "green" : "red" }}>
			{((value - 1) * 100).toFixed(2)}%
		</span>
	);
}

//{value > 1 ? <UpOutlined /> : <DownOutlined />}
