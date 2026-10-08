import React from 'react';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	Sequence,
	Series,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {
	Bloque,
	Clip,
	COLORES,
	FUENTE,
	MarcoLinea,
	Pildora,
	Plano,
	Region,
	Texto,
	Vidrio,
} from './componentes';
import {LOGO_PROJECTS, LOGO_UMAMI} from './logo-trazos';

const {naranja, gris, blanco, oliva, arena} = COLORES;

// 1 — Apertura sobre el salón lleno
const Apertura: React.FC = () => (
	<AbsoluteFill>
		<Clip src="salon-lleno" duracion={60} oscurecer={0.35} />
		<AbsoluteFill style={{justifyContent: 'center', padding: '0 70px'}}>
			<Texto texto="En Umami Projects" tamano={200} cadencia={5} sombra />
		</AbsoluteFill>
	</AbsoluteFill>
);

// 2 — Panel naranja arriba, el jigger abajo sin tapar
const Grupos: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: gris}}>
		<Region top={760} alto={1160}>
			<Clip src="jigger" duracion={80} oscurecer={0.05} zoom={[1, 1.08]} />
		</Region>
		<Bloque color={naranja} desde="arriba" alto={820} radio={64}>
			<Texto texto="trabajamos con grupos de restauración." color={gris} tamano={150} retraso={4} />
		</Bloque>
	</AbsoluteFill>
);

// 3 y 4 — Tamaño vs escala
const Tamano: React.FC = () => (
	<Plano color={arena}>
		<Texto texto="No es una cuestión de tamaño." color={gris} tamano={175} />
	</Plano>
);

const Escala: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - 14, fps, config: {damping: 12, stiffness: 120}});
	return (
		<Plano color={gris}>
			<Texto texto="Es una cuestión de" tamano={165} />
			<div
				style={{
					fontFamily: FUENTE,
					fontWeight: 800,
					fontSize: 300,
					letterSpacing: '-0.06em',
					color: naranja,
					lineHeight: 1,
					marginTop: 6,
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

// 5 — Estructura
const Estructura: React.FC = () => (
	<Plano color={oliva}>
		<Texto texto="Trabajamos la *estructura del negocio:" acento={arena} tamano={148} />
	</Plano>
);

// 6 — Las cinco palancas: clip a pantalla completa, marco de línea y tarjeta de vidrio
const PALANCAS: {texto: string; clip: string}[] = [
	{texto: 'Modelo de *viabilidad', clip: 'cerveza'},
	{texto: 'Operación *sistematizada', clip: 'chef-oscuro'},
	{texto: 'Ingeniería de *carta', clip: 'mesa-emplatada'},
	{texto: 'Cultura de *equipo', clip: 'bar-revolviendo'},
	{texto: 'Digitalización de *procesos', clip: 'barista'},
];
const DURACION_PALANCA = 33;

const Palancas: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrada = spring({frame: frame - 4, fps, config: {damping: 20, stiffness: 140}});
	return (
		<AbsoluteFill style={{backgroundColor: gris}}>
			{PALANCAS.map((p, i) => (
				<Sequence key={p.clip} from={i * DURACION_PALANCA} durationInFrames={DURACION_PALANCA}>
					<Clip src={p.clip} duracion={DURACION_PALANCA} oscurecer={0.2} zoom={[1.06, 1.12]} />
				</Sequence>
			))}
			<MarcoLinea duracion={36} />
			<div
				style={{
					position: 'absolute',
					left: 90,
					right: 90,
					bottom: 200,
					opacity: entrada,
					transform: `translateY(${(1 - entrada) * 120}px)`,
				}}
			>
				<Pildora texto="Estructura del negocio" style={{marginBottom: -36, marginLeft: 48, position: 'relative', zIndex: 2}} />
				<Vidrio style={{minHeight: 330, paddingTop: 80}}>
					{PALANCAS.map((p, i) => (
						<Sequence
							key={p.texto}
							from={i * DURACION_PALANCA}
							durationInFrames={DURACION_PALANCA}
							layout="none"
						>
							<Texto texto={p.texto} tamano={118} cadencia={3} retraso={i === 0 ? 8 : 0} ancho={760} />
						</Sequence>
					))}
				</Vidrio>
			</div>
		</AbsoluteFill>
	);
};

// 7 — Un cambio
const UnCambio: React.FC = () => (
	<Plano color={gris}>
		<Texto texto="Un cambio," tamano={230} />
	</Plano>
);

// 8 — Tres salones en franjas; el bloque naranja reemplaza por completo la del medio
const LOCALES = ['local-ventanal', 'local-lamparas', 'local-verde'];
const VariosLocales: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const numero = frame < 42 ? 3 : frame < 64 ? 4 : 5;
	const golpe = spring({
		frame: frame - (numero === 3 ? 18 : numero === 4 ? 42 : 64),
		fps,
		config: {damping: 10, stiffness: 200},
	});
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
			<Region top={640} alto={640}>
				<Bloque color={naranja} desde="arriba" alto={640} retraso={14} justificar="center">
					<div
						style={{
							fontFamily: FUENTE,
							fontWeight: 800,
							fontSize: 300,
							lineHeight: 0.85,
							letterSpacing: '-0.06em',
							color: gris,
							transform: `scale(${0.8 + 0.2 * golpe})`,
							transformOrigin: 'left bottom',
						}}
					>
						{numero}
					</div>
					<Texto texto="locales a la vez." color={gris} tamano={124} retraso={18} />
				</Bloque>
			</Region>
		</AbsoluteFill>
	);
};

// 9 — Más locales = más retorno (panel partido, restaurante abajo)
const Retorno: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: gris}}>
		<Region top={700} alto={1220}>
			<Clip src="restaurante" duracion={80} oscurecer={0.35} zoom={[1, 1.08]} />
		</Region>
		<Bloque color={naranja} desde="arriba" alto={760} radio={64}>
			<Texto texto="Más locales" color={gris} tamano={200} />
		</Bloque>
		<AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 70px 230px'}}>
			<Texto texto="= más *retorno." tamano={210} retraso={16} cadencia={5} sombra />
		</AbsoluteFill>
	</AbsoluteFill>
);

// 10 — Un solo local también vale (puente hacia el filtro)
const UnLocal: React.FC = () => (
	<AbsoluteFill>
		<Clip src="sarten-fuego" duracion={85} oscurecer={0.45} />
		<AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 70px 240px'}}>
			<Texto texto="Pero un solo local también puede ser un *gran *negocio." tamano={150} sombra />
		</AbsoluteFill>
	</AbsoluteFill>
);

// 11 — Pregunta
const Pregunta: React.FC = () => (
	<Plano color={arena}>
		<Texto texto="¿Tienes un solo local?" color={gris} tamano={185} />
	</Plano>
);

// 12 — Filtro
const Filtro: React.FC = () => (
	<AbsoluteFill>
		<Clip src="latte" duracion={80} oscurecer={0.45} />
		<AbsoluteFill style={{justifyContent: 'center', padding: '0 70px'}}>
			<Texto texto="Si tienes claro hacia dónde vas, *hablemos." tamano={160} sombra />
		</AbsoluteFill>
	</AbsoluteFill>
);

// 13 — Cierre
const Crecer: React.FC = () => (
	<AbsoluteFill>
		<Clip src="parrilla" duracion={75} oscurecer={0.4} />
		<AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 70px 260px'}}>
			<Texto texto="Negocios preparados para *crecer." tamano={185} sombra />
		</AbsoluteFill>
	</AbsoluteFill>
);

// 14 — Logo: el panel gris sube sobre la escena anterior y el logo se dibuja
const SOLAPE_MARCA = 15;
const Marca: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const suave = Easing.bezier(0.65, 0, 0.35, 1);
	const panel = interpolate(frame, [0, 22], [0, 1], {
		extrapolateRight: 'clamp',
		easing: suave,
	});
	const trazo = interpolate(frame, [16, 52], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const relleno = interpolate(frame, [40, 58], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const projects = interpolate(frame, [46, 66], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const linea = spring({frame: frame - 52, fps, config: {damping: 200}});
	const respiro = interpolate(frame, [20, 80], [0.94, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});
	return (
		<AbsoluteFill
			style={{
				backgroundColor: gris,
				transform: `translateY(${(1 - panel) * 1920}px)`,
				borderRadius: `${(1 - panel) * 140}px ${(1 - panel) * 140}px 0 0`,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div style={{transform: `scale(${respiro})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<svg width={780} viewBox="40 40 2720 824" style={{overflow: 'visible'}}>
					<defs>
						<clipPath id="revelar-projects">
							<rect x={40} y={0} width={2720 * projects} height={400} />
						</clipPath>
					</defs>
					<path
						d={LOGO_UMAMI}
						fill={blanco}
						fillOpacity={relleno}
						stroke={blanco}
						strokeWidth={6}
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - trazo}
						fillRule="evenodd"
					/>
					<g
						transform={`translate(0, ${544 + (1 - projects) * 40})`}
						opacity={projects}
						clipPath="url(#revelar-projects)"
					>
						<path d={LOGO_PROJECTS} fill={blanco} fillRule="evenodd" transform="translate(0,0)" />
					</g>
				</svg>
				<div
					style={{
						marginTop: 70,
						width: 260 * linea,
						height: 6,
						borderRadius: 3,
						backgroundColor: naranja,
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};

const ESCENAS: {c: React.FC; d: number; solape?: number}[] = [
	{c: Apertura, d: 60},
	{c: Grupos, d: 80},
	{c: Tamano, d: 50},
	{c: Escala, d: 70},
	{c: Estructura, d: 55},
	{c: Palancas, d: DURACION_PALANCA * PALANCAS.length},
	{c: UnCambio, d: 40},
	{c: VariosLocales, d: 105},
	{c: Retorno, d: 80},
	{c: UnLocal, d: 85},
	{c: Pregunta, d: 55},
	{c: Filtro, d: 80},
	{c: Crecer, d: 60},
	{c: Marca, d: 80, solape: SOLAPE_MARCA},
];

export const DURACION_TOTAL = ESCENAS.reduce((t, e) => t + e.d - (e.solape ?? 0), 0);

export const UmamiEscala: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: gris}}>
		<Series>
			{ESCENAS.map(({c: Escena, d, solape}, i) => (
				<Series.Sequence key={i} durationInFrames={d} offset={solape ? -solape : 0}>
					<Escena />
				</Series.Sequence>
			))}
		</Series>
	</AbsoluteFill>
);
