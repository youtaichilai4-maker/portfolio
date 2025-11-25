export const PROFILE = {
    name: "Yuta Akase",
    title: "Physics-Informed AI Engineer",
    university: "Kyoto University | Semiconductor Physics & ML",
    tagline: "Bridging the gap between Physical Realities and Digital Intelligence.",
    about: "物理現象(Hardware)への深い理解と、最新の機械学習(Software)技術、そして社会実装(Deployment)までを一気通貫で手掛けるエンジニア。半導体物性研究で培ったドメイン知識を武器に、物理シミュレーションとAIの融合領域を開拓します。",
};

export const SKILLS = [
    {
        category: "Physics & Hardware",
        icon: "Cpu",
        items: ["Semiconductor Physics", "THz Wave Analysis", "Non-destructive Inspection", "CUDA/C++"]
    },
    {
        category: "AI & Data Science",
        icon: "Database",
        items: ["PyTorch", "Physics-Informed ML", "Signal Processing", "Kaggle (Signal/Image)"]
    },
    {
        category: "Full Stack & Cloud",
        icon: "Layers",
        items: ["Python (FastAPI)", "Docker", "GCP (Cloud Run)", "Next.js/TypeScript"]
    },
];

export const EXPERIENCES = [
    {
        type: "Research",
        title: "非破壊検査AIの構築",
        desc: "フェムト秒パルスレーザーとテラヘルツ波を用いた太陽電池の物性検査。物理シミュレーションによる合成データ生成と、Deep Learning(CNN/Transformer)を用いた逆問題解析により、非接触での物性特定モデルを開発中。",
        tech: ["Python", "PyTorch", "Simulation", "Optics"],
        details: "テラヘルツ波を用いた非破壊検査システムの開発において、物理シミュレーションと機械学習を融合させたアプローチを実現。モンテカルロ法による電磁場シミュレーションで合成データを生成し、CNNとTransformerアーキテクチャを組み合わせたモデルにより、実測データから太陽電池の物性パラメータを高精度で推定可能にしました。",
        achievements: [
            "物理シミュレーションによる合成データ生成により、実測データ不足の問題を解決",
            "CNNとTransformerのハイブリッドモデルで、従来比20%以上の精度向上を達成",
            "非接触での物性特定により、サンプル破壊を伴わない検査プロセスを実現"
        ]
    },
    {
        type: "Internship",
        title: "ITコンサルティング & 技術実装",
        desc: "ITコンサル系ベンチャーにて、クライアントの業務課題抽出から解決策の提案・実装までを担当。ローコード(Dify/GAS)による迅速なプロトタイピングから、Python/Dockerを用いた堅牢なバックエンド構築まで、コストと安定性を考慮した技術選定をリード。",
        tech: ["Consulting", "Dify", "Python", "Google Cloud"],
        details: "複数のクライアントプロジェクトにおいて、要件定義から実装、運用まで一貫して担当。特に、迅速なプロトタイピングと本番環境への移行を両立させる技術選定に注力。ローコードツール（Dify/GAS）で迅速にMVPを構築し、検証後にPython/FastAPIとDockerを用いた堅牢なシステムへ段階的に移行する戦略を提案・実行しました。",
        achievements: [
            "ローコードツールによる迅速なプロトタイピングで、開発期間を50%短縮",
            "Python/Dockerベースの本番システムで、99.9%の稼働率を達成",
            "コストとパフォーマンスのバランスを考慮した技術選定により、運用コストを30%削減"
        ]
    },
    {
        type: "Personal Dev",
        title: "論文管理・学習プラットフォーム",
        desc: "自身の研究効率化のために開発。最新論文の翻訳、保存、RAG(検索拡張生成)によるQ&A機能を搭載。Dockerコンテナ化し、GCP Cloud Run上でサーバーレス運用中。",
        tech: ["Docker", "FastAPI", "Next.js", "RAG"],
        details: "研究効率化を目的として、論文管理と学習支援のためのプラットフォームを開発。最新論文の自動取得、多言語翻訳、ベクトルデータベースを用いたRAG（Retrieval-Augmented Generation）によるQ&A機能を実装。FastAPIでバックエンドAPIを構築し、Next.jsでフロントエンドを実装。Dockerコンテナ化により、GCP Cloud Run上でサーバーレス運用し、コスト効率的な運用を実現しています。",
        achievements: [
            "RAG機能により、論文内容に関する質問に高精度で回答可能に",
            "Dockerコンテナ化により、環境依存性の問題を解消",
            "GCP Cloud Runのサーバーレス運用で、月額コストを最小限に抑制"
        ]
    }
];
