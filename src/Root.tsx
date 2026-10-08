import {Composition} from 'remotion';
import {UmamiEscala, DURACION_TOTAL} from './UmamiEscala';

export const RemotionRoot: React.FC = () => (
	<Composition
		id="UmamiEscala"
		component={UmamiEscala}
		durationInFrames={DURACION_TOTAL}
		fps={30}
		width={1080}
		height={1920}
	/>
);
