export const PROFILE = {
    name: "Yuta Akase",
    title: "Physics × ML",
    university: "Kyoto University · M1, Kawayama Lab (Device Process Engineering)",
    tagline: "Bridging physics and machine learning to solve inverse problems in imaging and spectroscopy.",
    about:
        "ドメイン知識と実装力の両方で課題を解き、社会に届けるエンジニアを目指しています。研究では物理シミュレーション × 機械学習による逆問題推定、インターンではMLモデルを活用したプロダクト開発やバックエンド構築、個人開発ではSaaSの設計からデプロイまで——異なる文脈で技術に向き合ってきた経験を武器に、半導体物性評価の定量化や建築画像認識など、原理から実装までを一気通貫で設計しています。",
};

export const SKILLS = [
    {
        category: "Physics & Simulation",
        icon: "Cpu",
        items: [
            "Semiconductor Physics",
            "THz-TDS / LTEM",
            "Drift-Diffusion",
            "Monte Carlo",
            "Inverse Problems",
        ],
    },
    {
        category: "ML & Data",
        icon: "Database",
        items: [
            "PyTorch",
            "Physics-Informed Loss",
            "Mask2Former",
            "spaCy",
            "Signal Processing",
        ],
    },
    {
        category: "Full Stack & Cloud",
        icon: "Layers",
        items: [
            "Python (FastAPI)",
            "Next.js / TypeScript",
            "Docker · GCP (Cloud Run)",
            "python-pptx · Playwright",
            "Supabase · Render",
        ],
    },
];

export const EXPERIENCES = [
    {
        type: "Research",
        title: "THz-LTEM 逆問題 — 半導体物性の定量推定",
        desc:
            "LTEM（レーザーテラヘルツ放射顕微鏡）の「見えるが測れない」を「定量的に測れる」へ。物理シミュレーションでデータを生成し、逆問題を機械学習で解くパイプラインを自前実装。",
        tech: ["Python", "PyTorch", "Drift-Diffusion", "Monte Carlo", "SciPy"],
        details:
            "■ Motivation\nLTEM は p-n 接合や欠陥の空間分布を可視化できる強力なツールだが、現状は専門家が波形を目視で確認し、内部電場の向きや相対的な強さを定性判断するにとどまる。これを「E₀ が30%低下」「W_dep が0.2μm縮んだ」と定量抽出できれば、LTEM は視覚ツールから検査プラットフォームへと変わる。\n\n■ Why ML?\nTHz 波形は半導体内部の約20,000個のキャリア軌跡を空間積分・時間微分した結果であり、逆問題は解析的に閉じない。異なるパラメータ組み合わせがピーク振幅上で縮退する問題もあるが、波形全体には情報が分散しており、その非自明な特徴抽出に機械学習が必要。\n\n■ System\n順問題 (物性→波形) シミュレータとして 1D ドリフト拡散方程式 + Monte Carlo 粒子追跡を Python で自前実装。物理制約付き損失関数を設計し、物理法則に反する推定にペナルティを課す。\n\n■ Pivot\n当初は τ (キャリア寿命) の推定を目標としたが精度が伸びず、原因を物理的に分析した結果、波形の long-tail がノイズに埋もれるため τ 推定には本質的な限界があることを特定。立ち上がり情報に集中する μ (有効移動度) へターゲットを切り替えた。\n\n■ Next\n(1) 測定計画自体を最適化するアクティブラーニング, (2) Si 以外 (ワイドギャップ材料など) への対象拡張。",
        achievements: [
            "物理シミュレーション (Drift-Diffusion + Monte Carlo) を Python で自前実装し、合成波形データを生成",
            "物理制約付き損失関数を独自設計し PyTorch モデルに組み込み",
            "τ 推定の物理的限界を分析の上で断念し、μ 推定へ方針転換 (成果が出る領域への撤退判断)",
            "前処理→学習→推論を再現性のあるワンパスで自動化し、実験回転を高速化",
        ],
        images: [
            {
                src: "/research/test_sample_009.png",
                alt: "LTEM 測定データに基づく物性推定結果サンプル",
            },
        ],
    },
    {
        type: "Internship",
        title: "Pineal — HR SaaS & 社内ツールの自発的立ち上げ",
        desc:
            "SaaS のバックエンド開発と並行して、社内ユーザー（非エンジニア）の業務観察を起点にプレゼン生成ツールを自発的に提案・設計・実装。仕組みで品質を担保する設計思想を実践。",
        tech: ["Python", "FastAPI", "OSS 活用", "自動 QA", "チーム開発"],
        details:
            "■ Observing the Problem\n非エンジニアのチームメンバーが「伝えたい内容」以外の部分——見た目の調整やブランドガイドラインへの合わせ込み——に時間を溶かしている様子を観察。プレゼンの本質は内容であり、表現はテンプレート化で解決できるという仮説を自分で立て、上司に提案した。\n\n■ Finding the Right Abstraction\n競合調査で、既存アプローチには共通して「出力後に編集できない」という実用上致命的な欠点があることを特定。その制約を解決する OSS を発見し、設計思想を読み解いた上で社内の文脈に展開する独自アーキテクチャへ発展させた。\n\n■ Quality by Design\n自動化ツールは「まあまあ動く」が一番危ない。属人的な目視レビューに頼らず、視覚的な自動 QA を仕組みとして埋め込み、品質を属人性から切り離す設計にした。同じ「人手を介在させず仕組みで担保する」思想を、別のクライアント案件（センサーデータの外れ値処理改善）でも適用——非破壊的な最小介入で精度を大きく改善。\n\n■ What I took from this\nユーザー視点から逆算する設計、OSS を「部品」ではなく「設計思想」として読む習慣、品質を人手ではなく仕組みで担保する発想——が同時に回る経験。",
        achievements: [
            "非エンジニアの業務観察から、社内ツールを自発的に企画・設計・実装まで完遂",
            "OSS の設計思想を読み解いて社内文脈に展開する独自アーキテクチャを構築",
            "視覚的な自動 QA を組み込み、属人的レビューを排除する仕組み化を実現",
            "別クライアント案件では非破壊的な最小介入で計測精度を大幅改善",
        ],
    },
    {
        type: "Internship",
        title: "KK-Generation — 曖昧な要求を仕様にし、横断で届けた経験",
        desc:
            "建築画像認識 SaaS の新機能開発を、データ作成からモデル・後処理・UI 組み込みまで領域横断で担当。曖昧な要求から仕様を立ち上げ、エンドユーザーが扱える形式から逆算して設計する経験。",
        tech: ["Python", "PyTorch", "FastAPI", "React", "画像認識"],
        details:
            "■ Turning Ambiguity into Spec\nビジネス側から方針がふわっとした形で提示される状況。「この機能がどのユースケースで使われ、何がクリティカルか」を自分で整理するところから仕事を始めた。小さな疑問を言語化し、依頼元エンジニアと対話しながら仕様を固めるところまでを自分の仕事として引き受けた。\n\n■ Designing from the User's Shape\nML モデルの出力は、そのままではユーザーにとって使えない中間表現に過ぎない。「お客さんが最終的に扱いたい形式」から逆算して後処理を設計する——出力形式を先に決め、そこへ到達する処理を組み立てる、というアプローチを採った。\n\n■ Reading the Existing Codebase\n既存コードを読み込む中で、対象が違うだけで本質的に同じ処理構造を持つパイプラインを発見し、パラメータ調整のみで再利用。一方で、密結合した既存エンドポイントはそのまま拡張せず、独立エンドポイントとして分離することで影響範囲をゼロに抑える判断をした。「再利用すべき場所」と「分離すべき場所」を見分けるセンスを実地で鍛えた。\n\n■ What I took from this\n領域を跨いで通しで担当する経験、曖昧な要求を仕様に変える力、既存資産を読んで再利用と分離の判断基準を持つこと——が同時に動く経験。",
        achievements: [
            "データ作成・モデル・後処理・API・UI を領域横断でエンドツーエンド担当",
            "「ユーザーが扱える形式」から逆算して後処理を設計する発想を実践",
            "既存コードベースの構造を読み解き、異なる対象への賢い再利用を実現",
            "密結合を避ける独立実装の判断で、既存への影響範囲をゼロに抑制",
        ],
    },
    {
        type: "Personal Dev",
        title: "PaperLens — 自分の課題を起点に世に出した SaaS",
        desc:
            "自分自身の研究における課題（英語論文読解の遅さ）を起点に、3 ヶ月でゼロから設計・実装・デプロイした SaaS。UX のトレードオフ（速さ・プライバシー・コスト）を個別の技術選択ではなく設計判断の束として解く経験。",
        tech: ["FastAPI", "Next.js", "NLP", "LLM", "Chrome 拡張"],
        details:
            "■ Starting from My Own Pain\n論文を原文で読むことは研究の本質作業だが、英語がバリアになり読解が遅れる。辞書や Chat AI はオーバースペック——読みながら流れを止めずにパッと意味が出て保存もできるツールが欲しい。「自分のための欲しかったツール」として設計を始めた。\n\n■ Trade-offs as Design Decisions\nUX を決めるのは単発の技術選択ではなく、複数の設計判断の束だと気づいた。全文を LLM に投げない構成、応答を待たない見せ方、ユーザー自身の API キーを使う仕組み——それぞれは独立した判断に見えて、全体として「速さ・プライバシー・コスト」のバランスを同時に決めている。\n\n■ Ship It\n「動く」状態ではなく「他人が使える」状態にして初めて完成、という前提で設計した。3 ヶ月でゼロから設計・実装・公開版リリースまで通した。\n\n■ What I took from this\n自分の課題を起点にする強さ、UX を設計判断の束として扱う視点、そして完成させて世に出す経験——を個人開発で同時につけられた。",
        link: "https://paper-lens-intro.vercel.app/",
        linkLabel: "PaperLens 紹介サイト",
        achievements: [
            "自分自身の研究課題を起点に、3 ヶ月でゼロから設計・実装・公開まで完遂",
            "UX のトレードオフを設計判断の束として解く思想を実践",
            "ユーザー視点のインフラ判断（BYOK 等）でプライバシーとコストを両立",
            "完成させて世に出す経験を個人開発レベルで獲得",
        ],
    },
];
