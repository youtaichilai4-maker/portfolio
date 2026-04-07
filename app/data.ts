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
        title: "Pineal — HR SaaS バックエンド開発 & 社内ツール設計",
        desc: "HR SaaSプラットフォームのバックエンド開発に加え、HTML → PPTX 自動変換パイプライン「Pineal Slide Studio」を設計・実装。4,200行・26+スライドタイプ対応の社内ツールをゼロから構築し、非エンジニアがHTMLスライドからブランド準拠の編集可能なPPTXを生成できる仕組みを実現。",
        tech: ["Python", "python-pptx", "Playwright", "FastAPI", "Docker", "Claude Vision API"],
        details: "■ Pineal Slide Studio（主担当プロジェクト）\nHTML → 編集可能なネイティブPPTX を自動生成するパイプラインを設計・実装。\n\n【アーキテクチャ（4層設計）】\n1. Parser Layer: HTMLスライドをParseSlideデータクラスに変換。CSSクラスとHTMLディレクティブからスライドタイプを自動判定\n2. Dispatcher Layer: スライドタイプに応じて専用Builderにルーティング\n3. Builder Layer: python-pptxでネイティブシェイプを生成（画像貼り付けではなく編集可能な図形）\n4. Verification Layer: テキスト自動検証 + Playwrightスクリーンショット比較による視覚的QA\n\n【設計思想】\n・HTMLスライドを Single Source of Truth とし、PPTXは派生物として扱う\n・Design Tokens（tokens.py）でPineal Red Professionalテーマを一元管理\n・非エンジニアのユーザー体験を最優先に設計\n\n■ VIC Aqua Dashboard（クライアントプロジェクト）\n水位センサーデータの外れ値処理を改善。4手法を合成・実データで比較検証し、局所回帰補間法を提案。RMSE を43.87mm→3.87mmに改善（11倍の精度向上）。既存コードへの変更は1関数のみで、非破壊的に導入。\n\n■ HR SaaS バックエンド\nPythonバックエンド開発、DBクエリ最適化、コードレビューを通じたチーム開発を経験。",
        achievements: [
            "Slide Studio: 4,200行・26+スライドタイプ対応のHTML→PPTX変換パイプラインをゼロから設計・実装",
            "Parser→Dispatcher→Builder→Verificationの4層アーキテクチャで保守性と拡張性を両立",
            "VIC Aqua: 外れ値処理の改善でRMSE 11倍向上（43.87mm→3.87mm）を1関数の変更で実現",
            "Playwright + Claude Vision APIによる自動視覚QAで、手動検証を排除"
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
