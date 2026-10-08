import React from 'react';
import {
	AbsoluteFill,
	continueRender,
	delayRender,
	interpolate,
	OffthreadVideo,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';

// Espera a que Manrope esté cargada antes de capturar frames.
const esperaFuente = delayRender('Cargando Manrope');
Promise.all([
	document.fonts.load("800 100px 'Manrope'"),
	document.fonts.load("700 100px 'Manrope'"),
]).then(() => continueRender(esperaFuente));

export const COLORES = {
	naranja: '#F99F1A',
	gris: '#2A2A2A',
	blanco: '#FFFFFF',
	oliva: '#75864A',
	arena: '#E9DFC9',
};

export const FUENTE = "'Manrope', sans-serif";

// Clip de stock que llena su contenedor, con un zoom lento.
export const Clip: React.FC<{
	src: string;
	desde?: number;
	zoom?: [number, number];
	oscurecer?: number;
	duracion?: number;
}> = ({src, desde = 0, zoom = [1.04, 1.14], oscurecer = 0.25, duracion = 90}) => {
	const frame = useCurrentFrame();
	const escala = interpolate(frame, [0, duracion], zoom, {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{overflow: 'hidden', backgroundColor: COLORES.gris}}>
			<OffthreadVideo
				src={staticFile(`clips/${src}.mp4`)}
				startFrom={desde}
				muted
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `scale(${escala})`,
				}}
			/>
			<AbsoluteFill style={{backgroundColor: `rgba(0,0,0,${oscurecer})`}} />
		</AbsoluteFill>
	);
};

// Recorta un clip a una franja de la pantalla.
export const Region: React.FC<{top: number; alto: number; children: React.ReactNode}> = ({
	top,
	alto,
	children,
}) => (
	<div style={{position: 'absolute', top, left: 0, right: 0, height: alto, overflow: 'hidden'}}>
		{children}
	</div>
);

// Texto que entra palabra por palabra. Las palabras con *asterisco* van en color de acento.
export const Texto: React.FC<{
	texto: string;
	color?: string;
	acento?: string;
	tamano?: number;
	retraso?: number;
	cadencia?: number;
	alineacion?: 'left' | 'center';
	ancho?: number;
	sombra?: boolean;
}> = ({
	texto,
	color = COLORES.blanco,
	acento = COLORES.naranja,
	tamano = 150,
	retraso = 0,
	cadencia = 3,
	alineacion = 'left',
	ancho = 940,
	sombra = false,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const palabras = texto.split(' ');
	return (
		<div
			style={{
				fontFamily: FUENTE,
				fontWeight: 800,
				fontSize: tamano,
				lineHeight: 0.96,
				letterSpacing: '-0.05em',
				color,
				textAlign: alineacion,
				maxWidth: ancho,
				textShadow: sombra ? '0 6px 40px rgba(0,0,0,0.45)' : undefined,
			}}
		>
			{palabras.map((p, i) => {
				const resaltada = p.startsWith('*');
				const limpia = p.replace(/\*/g, '');
				const s = spring({
					frame: frame - retraso - i * cadencia,
					fps,
					config: {damping: 16, stiffness: 200, mass: 0.6},
				});
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							whiteSpace: 'pre',
							opacity: Math.min(1, s * 1.4),
							transform: `translateY(${(1 - s) * 70}px) scale(${0.92 + 0.08 * s})`,
							transformOrigin: 'left bottom',
							color: resaltada ? acento : color,
						}}
					>
						{limpia}
						{i < palabras.length - 1 ? ' ' : ''}
					</span>
				);
			})}
		</div>
	);
};

// Bloque de color que entra con un barrido vertical (panel partido).
export const Bloque: React.FC<{
	color: string;
	desde: 'arriba' | 'abajo';
	alto: number;
	retraso?: number;
	children?: React.ReactNode;
	padding?: string;
	justificar?: 'flex-start' | 'center' | 'flex-end';
	radio?: number;
}> = ({color, desde, alto, retraso = 0, children, padding = '0 70px', justificar = 'center', radio = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - retraso, fps, config: {damping: 22, stiffness: 160}});
	const esquinas =
		desde === 'arriba' ? `0 0 ${radio}px ${radio}px` : `${radio}px ${radio}px 0 0`;
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				[desde === 'arriba' ? 'top' : 'bottom']: 0,
				height: alto * s,
				backgroundColor: color,
				borderRadius: esquinas,
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: justificar,
				padding,
			}}
		>
			{children}
		</div>
	);
};

// Fondo plano de color con el texto centrado verticalmente.
export const Plano: React.FC<{color: string; children: React.ReactNode}> = ({color, children}) => (
	<AbsoluteFill
		style={{
			backgroundColor: color,
			justifyContent: 'center',
			alignItems: 'flex-start',
			padding: '0 70px',
		}}
	>
		{children}
	</AbsoluteFill>
);

// Marco de línea fina con esquinas redondeadas que se dibuja (detalle de las placas de Umami).
export const MarcoLinea: React.FC<{retraso?: number; duracion?: number; inset?: number; radio?: number}> = ({
	retraso = 0,
	duracion = 30,
	inset = 44,
	radio = 72,
}) => {
	const frame = useCurrentFrame();
	const avance = interpolate(frame - retraso, [0, duracion], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const suave = 1 - Math.pow(1 - avance, 3);
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<rect
				x={inset}
				y={inset}
				width={1080 - inset * 2}
				height={1920 - inset * 2}
				rx={radio}
				fill="none"
				stroke="rgba(255,255,255,0.85)"
				strokeWidth={3}
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - suave}
			/>
		</svg>
	);
};

// Tarjeta con efecto vidrio (blur + borde fino + esquinas tipo Apple).
export const Vidrio: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
	children,
	style,
}) => (
	<div
		style={{
			backgroundColor: 'rgba(42,42,42,0.28)',
			backdropFilter: 'blur(28px) saturate(140%)',
			WebkitBackdropFilter: 'blur(28px) saturate(140%)',
			border: '2px solid rgba(255,255,255,0.32)',
			borderRadius: 56,
			padding: '54px 60px 62px',
			boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
			...style,
		}}
	>
		{children}
	</div>
);

// Etiqueta tipo píldora blanca con texto naranja (como #TheUMAMIWay).
export const Pildora: React.FC<{texto: string; style?: React.CSSProperties}> = ({texto, style}) => (
	<div
		style={{
			display: 'inline-block',
			backgroundColor: COLORES.blanco,
			color: COLORES.naranja,
			fontFamily: FUENTE,
			fontWeight: 800,
			fontSize: 46,
			letterSpacing: '-0.02em',
			padding: '16px 40px',
			borderRadius: 999,
			...style,
		}}
	>
		{texto}
	</div>
);
