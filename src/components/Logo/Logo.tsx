import "./index.scss";

export default function Logo({ width = 200 }: { width?: number }) {
	return (
		<div
			className="logo"
			style={{ width }}
		>
			<img
				src="/assets/logo.svg"
				alt="logo"
			/>
		</div>
	);
}
