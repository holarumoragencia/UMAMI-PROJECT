import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORES, FUENTE} from './componentes';

const {naranja, gris, blanco, oliva, arena} = COLORES;

const avanzar = (frame: number, desde: number, hasta: number) =>
	interpolate(frame, [desde, hasta], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});

const Panel: React.FC<{
	top: number;
	left: number;
	ancho: number;
	alto: number;
	retraso: number;
	children: React.ReactNode;
}> = ({top, left, ancho, alto, retraso, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - retraso, fps, config: {damping: 18, stiffness: 170}});
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left,
				width: ancho,
				height: alto,
				borderRadius: 44,
				backgroundColor: 'rgba(255,255,255,0.06)',
				border: '2px solid rgba(255,255,255,0.14)',
				padding: '36px 44px',
				fontFamily: FUENTE,
				opacity: s,
				transform: `translateY(${(1 - s) * 60}px) scale(${0.96 + 0.04 * s})`,
			}}
		>
			{children}
		</div>
	);
};

const Etiqueta: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{fontSize: 34, fontWeight: 700, color: arena, opacity: 0.8, letterSpacing: '-0.01em'}}>
		{children}
	</div>
);

const formatear = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const VENTAS_POR_LOCAL = [0.62, 0.78, 0.55, 0.9, 0.7];

// Panel de gestión de un grupo de restauración que se construye en pantalla.
export const Dashboard: React.FC = () => {
	const frame = useCurrentFrame();
	const ventas = avanzar(frame, 4, 34);
	const anillo = avanzar(frame, 14, 40);
	const pulso = 0.5 + 0.5 * Math.sin(frame / 3);
	const radio = 74;
	const circunferencia = 2 * Math.PI * radio;
	return (
		<AbsoluteFill style={{backgroundColor: gris}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 20% 15%, rgba(117,134,74,0.35), transparent 55%), radial-gradient(circle at 85% 70%, rgba(249,159,26,0.18), transparent 50%)`,
				}}
			/>
			{/* Encabezado */}
			<div
				style={{
					position: 'absolute',
					top: 130,
					left: 100,
					right: 100,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					fontFamily: FUENTE,
					opacity: avanzar(frame, 0, 8),
				}}
			>
				<div style={{fontSize: 44, fontWeight: 800, color: blanco, letterSpacing: '-0.03em'}}>
					Panel del grupo
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 700, color: arena}}>
					<div
						style={{
							width: 18,
							height: 18,
							borderRadius: 9,
							backgroundColor: naranja,
							boxShadow: `0 0 ${10 + 16 * pulso}px ${naranja}`,
						}}
					/>
					En vivo
				</div>
			</div>

			{/* Ventas totales */}
			<Panel top={220} left={100} ancho={880} alto={250} retraso={2}>
				<Etiqueta>Ventas de hoy · 5 locales</Etiqueta>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 14}}>
					<div style={{fontSize: 120, fontWeight: 800, color: blanco, letterSpacing: '-0.05em', lineHeight: 1}}>
						€{formatear(48320 * ventas)}
					</div>
					<div
						style={{
							fontSize: 34,
							fontWeight: 800,
							color: blanco,
							backgroundColor: oliva,
							borderRadius: 999,
							padding: '8px 22px',
							opacity: avanzar(frame, 22, 30),
						}}
					>
						↑ 12%
					</div>
				</div>
			</Panel>

			{/* Ventas por local */}
			<Panel top={500} left={100} ancho={880} alto={430} retraso={6}>
				<Etiqueta>Ventas por local</Etiqueta>
				<div style={{display: 'flex', alignItems: 'flex-end', gap: 26, height: 250, marginTop: 30}}>
					{VENTAS_POR_LOCAL.map((v, i) => {
						const h = avanzar(frame, 10 + i * 3, 28 + i * 3);
						return (
							<div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
								<div style={{height: 250, width: '100%', display: 'flex', alignItems: 'flex-end'}}>
									<div
										style={{
											width: '100%',
											height: 250 * v * h,
											backgroundColor: naranja,
											borderRadius: '14px 14px 4px 4px',
										}}
									/>
								</div>
								<div style={{fontSize: 28, fontWeight: 700, color: arena, opacity: 0.75}}>L{i + 1}</div>
							</div>
						);
					})}
				</div>
			</Panel>

			{/* Food cost + tickets */}
			<Panel top={960} left={100} ancho={425} alto={300} retraso={10}>
				<Etiqueta>Food cost</Etiqueta>
				<div style={{position: 'relative', width: 180, height: 180, marginTop: 18}}>
					<svg width={180} height={180} style={{transform: 'rotate(-90deg)'}}>
						<circle cx={90} cy={90} r={radio} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={16} />
						<circle
							cx={90}
							cy={90}
							r={radio}
							fill="none"
							stroke={oliva}
							strokeWidth={16}
							strokeLinecap="round"
							strokeDasharray={circunferencia}
							strokeDashoffset={circunferencia * (1 - 0.28 * anillo)}
						/>
					</svg>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 52,
							fontWeight: 800,
							color: blanco,
							letterSpacing: '-0.04em',
						}}
					>
						{Math.round(28 * anillo)}%
					</div>
				</div>
			</Panel>
			<Panel top={960} left={555} ancho={425} alto={300} retraso={13}>
				<Etiqueta>Tickets</Etiqueta>
				<div style={{fontSize: 96, fontWeight: 800, color: blanco, letterSpacing: '-0.05em', marginTop: 22, lineHeight: 1}}>
					{formatear(1284 * avanzar(frame, 14, 40))}
				</div>
				<svg width={337} height={70} style={{marginTop: 24}}>
					<polyline
						points="0,58 48,46 96,52 144,30 192,36 240,18 288,22 337,6"
						fill="none"
						stroke={naranja}
						strokeWidth={5}
						strokeLinecap="round"
						strokeLinejoin="round"
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - avanzar(frame, 16, 40)}
					/>
				</svg>
			</Panel>
		</AbsoluteFill>
	);
};
