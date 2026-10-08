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

// Clip de stock a pantalla completa (o dentro de un contenedor) con un zoom lento.
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

// Texto que entra palabra por palabra. Las palabras con *asterisco* van en color de acento.
export const Texto: React.FC<{
	texto: string;
	color?: string;
	acento?: string;
	tamano?: number;
	retraso?: number;
	cadencia?: number;
	alineacion?: 'left' | 'center';
	peso?: number;
	ancho?: number;
}> = ({
	texto,
	color = COLORES.blanco,
	acento = COLORES.naranja,
	tamano = 120,
	retraso = 0,
	cadencia = 3,
	alineacion = 'left',
	peso = 800,
	ancho = 920,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const palabras = texto.split(' ');
	return (
		<div
			style={{
				fontFamily: FUENTE,
				fontWeight: peso,
				fontSize: tamano,
				lineHeight: 1.02,
				letterSpacing: '-0.035em',
				color,
				textAlign: alineacion,
				maxWidth: ancho,
			}}
		>
			{palabras.map((p, i) => {
				const resaltada = p.startsWith('*');
				const limpia = p.replace(/\*/g, '');
				const s = spring({
					frame: frame - retraso - i * cadencia,
					fps,
					config: {damping: 18, stiffness: 180, mass: 0.6},
				});
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							whiteSpace: 'pre',
							opacity: s,
							transform: `translateY(${(1 - s) * 50}px)`,
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

// Bloque de color que entra con un barrido vertical (estilo panel partido).
export const Bloque: React.FC<{
	color: string;
	desde: 'arriba' | 'abajo';
	alto: number;
	retraso?: number;
	children?: React.ReactNode;
	padding?: string;
	justificar?: 'flex-start' | 'center' | 'flex-end';
}> = ({color, desde, alto, retraso = 0, children, padding = '0 80px', justificar = 'center'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - retraso, fps, config: {damping: 22, stiffness: 160}});
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				[desde === 'arriba' ? 'top' : 'bottom']: 0,
				height: alto * s,
				backgroundColor: color,
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
export const Plano: React.FC<{color: string; children: React.ReactNode; centrado?: boolean}> = ({
	color,
	children,
	centrado = false,
}) => (
	<AbsoluteFill
		style={{
			backgroundColor: color,
			justifyContent: 'center',
			alignItems: centrado ? 'center' : 'flex-start',
			padding: '0 80px',
		}}
	>
		{children}
	</AbsoluteFill>
);
