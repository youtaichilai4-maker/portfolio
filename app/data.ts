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
        title: "LTEM計測の自動化・高精度化に向けた、シミュレーションベース物性推定AI基盤の構築",
        desc: "シミュレーション生成データを活用し、LTEMラインプロファイルから物性を高速・自動推定する基盤を構築。属人化していたパラメータ調整を排除し、研究者が発見に集中できる環境づくり、製造ラインでの半導体の物性検査の自動化を目指す",
        tech: ["Python", "PyTorch", "Simulation", "LTEM"],
        details: "■Vision & Impact\n複雑材料のLTEM解析における属人性を排除し、計測から物性推定までを「高速・再現可能・自動化」するパイプラインを構築。研究者がパラメータ調整などの単純作業から解放され、製造ラインでの不良品検査など応用手法は数知れず\n\n■System Architecture\n1. Simulation & Data Staging: 物理シミュレーションで多条件のLTEMラインプロファイルを生成し、.npz形式で管理することで完全な再現性を確保。\n2. Pipeline Design: 「前処理」と「学習」を明確に分離し、特徴量エンジニアリングやハイパーパラメータ探索を最小コストで高速に検証可能に。\n3. End-to-End Automation: 生データ入力から推論出力までをワンパスで実行し、人為的ミスを排除。\n\n■Implementation\n軽量1Dモデルを用いて τ, W, E などの物性を回帰/分類。エッジデバイスやリアルタイム処理を見据えた設計を採用。検証セットの厳密な分離とモデル感度の可視化により、データ品質とモデル挙動を定量的に管理しています。\n\n■Quantitative Results\n最新の検証セットにおいて、R^2（決定係数）は0.9台を達成。従来の手動解析と比較して大幅な時間短縮と精度向上を実現しています。\n\n■Future Roadmap\n単なる精度向上にとどまらず、システム全体の「自律化」を目指します。\n・3D全自動マッピング: 画像取得から3D再構成までの完全自動化。\n・Active Learning: モデルの推定不確実性をフィードバックし、装置が自動で追加スキャンを行う「自律実験ループ」の構築。\nこれにより、最小の実験コストで最大の情報を得る次世代の計測システムを確立します。",
        images: [
            {
                src: "/research/test_sample_009.png",
                alt: "LTEM測定データに基づく物性推定結果サンプル"
            }
        ],
        achievements: [
            "Simulation→前処理→学習→推論を再現性あるワンパスで自動化し、手作業を排除",
            "特徴量とハイパラを分離した設計で探索コストを削減し、高速な差分検証を実現",
            "将来は3D自動マッピングとアクティブサンプリングへ拡張"
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
        title: "PaperLens (論文管理・学習ツール)",
        desc: "論文要約・専門用語/英単語抽出・翻訳・保存をワンストップで行うブラウザ拡張兼Webアプリ。Render上のFastAPIバックエンドとNext.jsフロントで提供し、研究の下調べを数分に短縮。",
        tech: ["Next.js/TypeScript", "FastAPI", "spaCy + Gemini", "Supabase", "Render"],
        details: "論文読みのペインを解消するためにPaperLensへリブランディング。spaCyで全文を約0.5秒でスキャンし重要語句を抽出、Gemini 1.5 Flashで要約と厳選、選択テキストを即座に翻訳・解説。抽出した専門用語・英単語・要約はSupabaseに保存し、Render上のFastAPIで提供。BYOKモデルでAPIキーはブラウザ内にのみ保持。紹介サイト: https://paper-lens-intro.vercel.app/",
        link: "https://paper-lens-intro.vercel.app/",
        linkLabel: "PaperLens 紹介サイト（画面イメージはこちら）",
        achievements: [
            "専門用語・英単語抽出/要約/翻訳/保存をブラウザサイドバーで一貫提供し、読解時間を大幅短縮",
            "spaCy×Geminiのハイブリッドで精度と速度を両立（全文0.5秒スキャンを確認）",
            "Render上のFastAPI＋Supabase構成でBYOKを維持しつつ安定運用"
        ]
    }
];
