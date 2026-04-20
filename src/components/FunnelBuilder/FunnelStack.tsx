import { motion } from 'framer-motion';

interface FunnelStackProps {
    stages: any[];
    onStageSelect: (stage: any) => void;
    activeStage: any;
}

export function FunnelStack({ stages, onStageSelect, activeStage }: FunnelStackProps) {
    const layerStyles: Record<string, string> = {
        awareness: 'layer-awareness',
        interest: 'layer-interest',
        consideration: 'layer-consideration',
        intent: 'layer-intent',
        evaluation: 'layer-evaluation',
        purchase: 'layer-purchase',
        retention: 'layer-loyalty',
        default: 'layer-evaluation'
    };

    // Calculate dimensions based on index
    const getLayerWidth = (index: number, total: number) => {
        const minWidth = 30;
        const step = (100 - minWidth) / (total - 1 || 1);
        return `${100 - (step * index)}%`;
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-8 space-y-4 z-10 w-full mesh-bg rounded-[3rem] border border-architect-border/50 relative overflow-hidden h-[700px]">
            {stages.map((stage, idx) => {
                const isActive = activeStage?.name === stage.name;
                const styleName = layerStyles[stage.name.toLowerCase()] || layerStyles.default;
                const width = getLayerWidth(idx, stages.length);
                const isTop = idx === 0;

                return (
                    <motion.div
                        key={stage.name}
                        onClick={() => onStageSelect(stage)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{ width }}
                        className={`funnel-layer ${styleName} ${isActive ? 'active-layer-glow' : ''} h-16 rounded-full backdrop-blur-[20px] flex items-center justify-between px-8 cursor-pointer transform hover:scale-[1.02] border border-outline-variant/15`}
                    >
                        <div className="flex items-center space-x-4 z-10">
                            <span className="font-headline font-bold text-lg text-white capitalize">{stage.label || stage.name}</span>
                        </div>
                        {isTop && (
                            <div className="flex space-x-3 z-10 hidden sm:flex">
                                <span className="px-4 py-1.5 rounded-full bg-black/40 text-white/70 text-xs font-bold border border-white/10 uppercase tracking-widest">{stage.kpis?.[0] || 'METRIC'}</span>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
