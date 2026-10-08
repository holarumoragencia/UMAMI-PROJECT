import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	Series,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Bloque, Clip, COLORES, FUENTE, Plano, Texto} from './componentes';

const {naranja, gris, blanco, oliva, arena} = COLORES;

// 1 — Apertura sobre el salón lleno
const Apertura: React.FC = () => (
	<AbsoluteFill>
		<Clip src="salon-lleno" duracion={60} oscurecer={0.35} />
		<AbsoluteFill style={{justifyContent: 'center', padding: '0 80px'}}>
			<Texto texto="En Umami Projects" tamano={150} cadencia={5} />
		</AbsoluteFill>
	</AbsoluteFill>
);

// 2 — Panel naranja arriba + barra abajo
const Grupos: React.FC = () => (
	<AbsoluteFill>
		<Clip src="bar-coctel" duracion={75} oscurecer={0.1} />
		<Bloque color={naranja} desde="arriba" alto={900}>
			<Texto texto="trabajamos con grupos de restauración." color={gris} tamano={112} retraso={4} />
		</Bloque>
	</AbsoluteFill>
);

// 3 y 4 — Tamaño vs escala
const Tamano: React.FC = () => (
	<Plano color={arena}>
		<Texto texto="No es una cuestión de tamaño." color={gris} tamano={130} />
	</Plano>
);

const Escala: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - 14, fps, config: {damping: 12, stiffness: 120}});
	return (
		<Plano color={gris}>
			<Texto texto="Es una cuestión de" tamano={130} />
			<div
				style={{
					fontFamily: FUENTE,
					fontWeight: 800,
					fontSize: 230,
					letterSpacing: '-0.05em',
					color: naranja,
					lineHeight: 1,
					marginTop: 10,
					opacity: s,
					transform: `scale(${0.6 + 0.4 * s})`,
					transformOrigin: 'left center',
				}}
			>
				escala.
			</div>
		</Plano>
	);
};

// 5 — Un solo local también vale
const UnLocal: React.FC = () => (
	<AbsoluteFill>
		<Clip src="bar-secando" duracion={85} oscurecer={0.4} />
		<AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 80px 260px'}}>
			<Texto texto="Un solo local también puede ser un *gran *negocio." tamano={118} />
		</AbsoluteFill>
	</AbsoluteFill>
);

// 6 — Estructura
const Estructura: React.FC = () => (
	<Plano color={oliva}>
		<Texto texto="Trabajamos la *estructura del negocio:" acento={arena} tamano={130} />
	</Plano>
);

// 7 — Las cinco palancas, una por corte
const PALANCAS: {texto: string; clip: string; fondo: string; tinta: string; desde?: number}[] = [
	{texto: 'Modelo de viabilidad', clip: 'cerveza', fondo: naranja, tinta: gris},
	{texto: 'Operación sistematizada', clip: 'chef-oscuro', fondo: oliva, tinta: blanco},
	{texto: 'Ingeniería de carta', clip: 'mesa-emplatada', fondo: arena, tinta: gris},
	{texto: 'Cultura de equipo', clip: 'bar-revolviendo', fondo: gris, tinta: blanco},
	{texto: 'Digitalización de procesos', clip: 'barista', fondo: naranja, tinta: gris},
];
export const DURACION_PALANCA = 30;

const Palanca: React.FC<{i: number}> = ({i}) => {
	const p = PALANCAS[i];
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 1220}}>
				<Clip src={p.clip} duracion={DURACION_PALANCA} oscurecer={0.05} />
			</div>
			<Bloque color={p.fondo} desde="abajo" alto={700} retraso={0} justificar="center">
				<div
					style={{
						fontFamily: FUENTE,
						fontWeight: 700,
						fontSize: 40,
						letterSpacing: '0.1em',
						color: p.tinta,
						opacity: 0.7,
						marginBottom: 24,
					}}
				>
					0{i + 1} / 05
				</div>
				<Texto texto={p.texto} color={p.tinta} tamano={112} cadencia={2} />
			</Bloque>
		</AbsoluteFill>
	);
};

// 8 — Un cambio
const UnCambio: React.FC = () => (
	<Plano color={gris}>
		<Texto texto="Un cambio," tamano={170} />
	</Plano>
);

// 9 — Tres salones en franjas + contador 3 → 4 → 5
const LOCALES = ['local-ventanal', 'local-lamparas', 'local-verde'];
const VariosLocales: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const numero = frame < 40 ? 3 : frame < 62 ? 4 : 5;
	const golpe = spring({frame: frame - (numero === 3 ? 18 : numero === 4 ? 40 : 62), fps, config: {damping: 10, stiffness: 200}});
	return (
		<AbsoluteFill style={{backgroundColor: gris}}>
			{LOCALES.map((src, i) => {
				const s = spring({frame: frame - i * 5, fps, config: {damping: 20, stiffness: 140}});
				return (
					<div
						key={src}
						style={{
							position: 'absolute',
							top: i * 640,
							left: 0,
							width: 1080,
							height: 640,
							overflow: 'hidden',
							transform: `translateX(${(1 - s) * (i % 2 === 0 ? -1080 : 1080)}px)`,
						}}
					>
						<Clip src={src} duracion={105} oscurecer={0.2} />
					</div>
				);
			})}
			<div style={{position: 'absolute', top: 660, left: 0, right: 0, height: 600}}>
				<Bloque color={naranja} desde="arriba" alto={600} retraso={14} padding="0 80px" justificar="center">
					<div
						style={{
							fontFamily: FUENTE,
							fontWeight: 800,
							fontSize: 280,
							lineHeight: 0.9,
							letterSpacing: '-0.05em',
							color: gris,
							transform: `scale(${0.8 + 0.2 * golpe})`,
							transformOrigin: 'left bottom',
						}}
					>
						{numero}
					</div>
					<Texto texto="locales a la vez." color={gris} tamano={110} retraso={18} ancho={940} />
				</Bloque>
			</div>
		</AbsoluteFill>
	);
};

// 10 — Más locales = más retorno (panel partido)
const Retorno: React.FC = () => (
	<AbsoluteFill>
		<Clip src="parrilla" duracion={75} oscurecer={0.3} />
		<Bloque color={naranja} desde="arriba" alto={760}>
			<Texto texto="Más locales" color={gris} tamano={140} />
		</Bloque>
		<AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 80px 380px'}}>
			<Texto texto="= más retorno." tamano={140} retraso={14} />
		</AbsoluteFill>
	</AbsoluteFill>
);

// 11 — Pregunta
const Pregunta: React.FC = () => (
	<Plano color={arena}>
		<Texto texto="¿Tienes un solo local?" color={gris} acento={oliva} tamano={140} />
	</Plano>
);

// 12 — Filtro
const Filtro: React.FC = () => (
	<AbsoluteFill>
		<Clip src="latte" duracion={80} oscurecer={0.4} />
		<AbsoluteFill style={{justifyContent: 'center', padding: '0 80px'}}>
			<Texto texto="Si tienes claro hacia dónde vas, *hablemos." tamano={120} />
		</AbsoluteFill>
	</AbsoluteFill>
);

// 13 — Cierre
const Crecer: React.FC = () => (
	<AbsoluteFill>
		<Clip src="sarten-fuego" duracion={60} oscurecer={0.45} />
		<AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 80px 300px'}}>
			<Texto texto="Negocios preparados para *crecer." tamano={140} />
		</AbsoluteFill>
	</AbsoluteFill>
);

// 14 — Logo + CTA
const Marca: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = spring({frame, fps, config: {damping: 20, stiffness: 120}});
	const cta = spring({frame: frame - 18, fps, config: {damping: 14, stiffness: 160}});
	return (
		<AbsoluteFill style={{backgroundColor: gris, justifyContent: 'center', alignItems: 'center'}}>
			<Img
				src={staticFile('brand/logo-blanco.png')}
				style={{
					width: 720,
					opacity: logo,
					transform: `translateY(${(1 - logo) * 40}px)`,
				}}
			/>
			<div
				style={{
					marginTop: 110,
					backgroundColor: naranja,
					color: gris,
					fontFamily: FUENTE,
					fontWeight: 800,
					fontSize: 72,
					letterSpacing: '-0.02em',
					padding: '26px 70px',
					borderRadius: 999,
					opacity: cta,
					transform: `scale(${interpolate(cta, [0, 1], [0.7, 1])})`,
				}}
			>
				Hablemos
			</div>
		</AbsoluteFill>
	);
};

const ESCENAS: {c: React.FC; d: number}[] = [
	{c: Apertura, d: 60},
	{c: Grupos, d: 75},
	{c: Tamano, d: 50},
	{c: Escala, d: 70},
	{c: UnLocal, d: 85},
	{c: Estructura, d: 55},
	...PALANCAS.map((_, i) => ({c: () => <Palanca i={i} />, d: DURACION_PALANCA})),
	{c: UnCambio, d: 40},
	{c: VariosLocales, d: 105},
	{c: Retorno, d: 75},
	{c: Pregunta, d: 55},
	{c: Filtro, d: 80},
	{c: Crecer, d: 60},
	{c: Marca, d: 90},
];

export const DURACION_TOTAL = ESCENAS.reduce((t, e) => t + e.d, 0);

export const UmamiEscala: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: gris}}>
		<Series>
			{ESCENAS.map(({c: Escena, d}, i) => (
				<Series.Sequence key={i} durationInFrames={d}>
					<Escena />
				</Series.Sequence>
			))}
		</Series>
	</AbsoluteFill>
);
