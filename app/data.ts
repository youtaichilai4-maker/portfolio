export const PROFILE = {
    name: "Yuta Akase",
    title: "Physics × ML × Product",
    university: "Kyoto University · M1, Kawayama Lab (Device Process Engineering)",
    tagline: "Bridging physics and machine learning to solve inverse problems — and shipping them as products.",
    // Plain one-paragraph summary (used by /simple).
    about:
        "ドメイン知識と実装力の両方で課題を解き、社会に届けるエンジニアを目指しています。研究では半導体検査における物理シミュレーション × 機械学習による逆問題推定に、インターン・業務委託では機械学習モデルの開発からアルゴリズム・エンドポイント・基盤開発まで取り組み、原理的なところから実装まで一気通貫で設計しています。",
};

// Hero (profile.md) — the same list feeds the left source and the right cards.
export const HERO = {
    role: "Physics × ML",
    lead: [
        "I build bridges between physics and machine learning",
        "to solve inverse problems in imaging and spectroscopy.",
    ],
    cards: [
        {
            label: "Contract",
            title: "KK-Generation",
            note: "建築会社の課題から 0→1 プロダクトへ",
        },
        {
            label: "Research",
            title: "THz-LTEM Inverse Problem",
            note: "定性解析を定量解析へ · 応物 2026 秋",
        },
        {
            label: "Internship",
            title: "Risk-Based Authentication",
            note: "ログインフローの追加認証 · Go / gRPC",
        },
        {
            label: "Internship",
            title: "Pineal",
            note: "採用面接AI · 評価基盤の設計",
        },
    ],
};

// Markdown bodies — rendered verbatim on the left, rendered as HTML on the right.
// Intro — a full-page "about me": short bullets, plain (言い切り) endings.
export const INTRO = {
    label: "はじめまして · about me",
    heading: "赤瀬 優太　奈良県出身のエンジニア",
    bullets: [
        "大学では電気電子工学を専攻。半導体の物性や電気回路・制御を勉強",
        "そんな中で課されたプログラミング演習に大苦戦。意味のわからないエラーに頭を悩ませ、「エンジニアにだけはならない」と決意",
        "学部時代はアカペラに熱中。人を笑顔にする演奏、いい演奏とは何かを追い求め続ける",
        "学部4年の夏、院試を終えたあとに友人に誘われ、時給も良かったのでエンジニアとしてのキャリアをスタート",
        "これがきっかけでどハマり。魔法のようだと思っていたソフトウェアも、簡単な動作の積み重ねでできている",
        "魔法は作れる。そのことに感動し、自分も作る側になろうと決意",
        "それからは研究・インターン・実務の経験を自分の技術にフィードバックし続け、毎日ひいひい言いながら楽しく勉強中",
    ],
    closing: "学んだ技術で誰かの課題を解決し、笑顔にすること。それが原動力。",
};

export const ABOUT_MD = `## About

ドメイン知識と実装力の両方で課題を解き、**社会に届けるエンジニア**を目指しています。

### Research
研究では、半導体検査における物理シミュレーション × 機械学習による逆問題推定に取り組んでいます。

### Engineering
インターン・業務委託では、機械学習モデルの開発と、それを活かす後処理アルゴリズムのチューニングやエンドポイントの構築に加え、ソフトウェアエンジニアとして基盤・プラットフォームの開発にも携わってきました。

### Approach
さまざまな方向から技術に向き合ってきた経験を武器に、原理的なところから実装まで一気通貫で設計しています。`;

export type SkillItem = { name: string; usedIn: string };

export const SKILLS: { category: string; icon: string; items: SkillItem[] }[] = [
    {
        category: "Physics & Simulation",
        icon: "Cpu",
        items: [
            { name: "Semiconductor Physics", usedIn: "学部〜研究 · p-n 接合・ドーピング" },
            { name: "THz-TDS / LTEM", usedIn: "研究 · テラヘルツ放射波形の計測と解析" },
            { name: "Drift-Diffusion", usedIn: "研究 · キャリア輸送の物理モデル" },
            { name: "Monte Carlo", usedIn: "研究 · C++ シミュレーターの拡張" },
            { name: "Inverse Problems", usedIn: "研究 · 波形から物性を推定" },
        ],
    },
    {
        category: "Machine Learning",
        icon: "Database",
        items: [
            { name: "PyTorch", usedIn: "研究 / KK-Generation" },
            { name: "Physics-Informed Loss", usedIn: "研究 · 物理制約付き損失関数" },
            { name: "Transformer 系モデル (Mask2Former)", usedIn: "KK-Generation · 図面の柱・梁検出" },
        ],
    },
    {
        category: "Software & Cloud",
        icon: "Layers",
        items: [
            { name: "Python", usedIn: "研究 / KK-Generation / Pineal" },
            { name: "Go · gRPC", usedIn: "認証認可インターン" },
            { name: "TypeScript · Next.js", usedIn: "KK-Generation / このサイト" },
            { name: "PostgreSQL", usedIn: "個人開発 / インターン" },
            { name: "Valkey · Lua", usedIn: "インターン · キーバリューストア" },
            { name: "Playwright", usedIn: "Pineal · 視覚的自動QA" },
            { name: "Docker · AWS", usedIn: "KK-Generation · ECS Fargate / Terraform" },
            { name: "認証認可", usedIn: "リスクベース認証 / 認可設計" },
        ],
    },
];

export type Experience = {
    type: string;
    title: string;
    short: string;
    slug: string;
    signature: string;
    desc: string;
    tech: string[];
    achievements: string[];
    /** Markdown — "###" headings, "- " bullets, **bold**. */
    details: string;
    images?: { src: string; alt: string }[];
    visual?: "kkg" | "auth" | "pineal";
};

export const EXPERIENCES: Experience[] = [
    {
        type: "Contract",
        title: "KK-Generation — 建築会社の課題から、0→1 のプロダクトを届ける",
        short: "KK-Generation",
        slug: "contract/kk-generation.md",
        signature: "solution = f( customer's problem )",
        desc:
            "建築図面AI SaaS の業務委託エンジニア。建築会社が抱える課題を起点に、技術を手段として、それを解決するツールを届けています。新規プロダクトの立ち上げに新機能開発から携わり、モデル開発・アルゴリズム実装・エンドポイント・アプリ・基盤開発まで一通り担当しています。",
        tech: ["Python", "PyTorch", "Mask2Former", "FastAPI", "Next.js", "AWS"],
        achievements: [
            "建築会社の課題を起点に、新規プロダクトの立ち上げへ新機能開発から参画",
            "モデル開発・アルゴリズム・エンドポイント・アプリ・基盤のすべてを担当",
            "エンドユーザーが扱う形式から逆算した後処理・出力設計",
            "拡張性・スケーラビリティを見据えた再利用と分離の開発判断",
        ],
        details: `### Problem First
建築会社の現場には、図面からの数量拾い出しのように「時間がかかる」「人に依存する」課題がはっきりと存在します。プロダクトアウトではなくマーケットインで、**お客さんの課題だけを正解（Source of Truth）** に置く。そこへどうアプローチするかの絵を描けるのは、技術を持っている自分たちだけだと考えて取り組んでいます。

### From Problem to Product
仕様を渡してくれる依頼元がいるわけではありません。会社として「ここに課題がある」と分かっている領域に対して、図面や業務のドメインを理解し、解決策をプロダクトの形に落とし込むところから自分の仕事にしています。技術的にも前例の少ないことへの挑戦です。

### Model → Algorithm → Endpoint → App → Platform
- モデル開発: 構造伏図の柱・梁検出（アノテーション設計 → Mask2Former 転移学習）、電気設備図面のシンボル検出
- アルゴリズム: 検出結果を活かす後処理（スケルトン化・連結成分分析・線分トレーシング）、ベクターPDF直読・符号マッチング
- エンドポイント: FastAPI による本番 backend への統合
- アプリ: 新規プロダクト（材料拾い出し）の新機能開発
- 基盤: AWS（ECS Fargate / Terraform / GitHub Actions）上の CI/CD 運用、R&D ナレッジ基盤の認可設計

### Designing from the User's Shape
ML モデルの出力は、そのままではユーザーにとって使えない中間表現にすぎません。「お客さんが最終的に扱いたい形式」から逆算して、後処理と出力を設計しました。

### Building for What Comes Next
既存コードベースの構造を読み込み、本質的に同じ処理構造を持つパイプラインは再利用する。一方で、対象の今後の拡張性・スケーラビリティを考えて、どこを共通化しどこを分けるか。そうした開発判断を随所で任されてきました。

### What I Took from This
課題に対する感度と、それを技術で解き切る力。この2つが自分の強みであり、それを一番磨けたのがこの経験です。`,
        images: [
            {
                src: "/kkg/kkg-drawing-ai-mockup.svg",
                alt: "建築図面AIの検出イメージ（説明用の架空図面によるモックアップ）",
            },
        ],
    },
    {
        type: "Research",
        title: "THz-LTEM 逆問題 — 定性解析を定量解析へ",
        short: "THz-LTEM",
        slug: "research/thz-ltem.md",
        signature: "∂n/∂t = D∇²n + μE·∇n − n/τ + G",
        desc:
            "レーザーテラヘルツ放射顕微鏡（LTEM）の解析を、定性的な解析から定量的な解析へアップデートする、手法そのもののアップデートの研究です。研究の発案者・代表として進めており、2026年秋の応用物理学会で発表しました。",
        tech: ["Python", "PyTorch", "C++", "Monte Carlo", "Physics-Informed ML"],
        achievements: [
            "定性的だった LTEM 解析を、定量解析へアップデートする手法を研究",
            "C++ の OSS シミュレーターをフォークし、物理条件・制約条件を追加して合成データを生成",
            "物理制約付き損失関数を設計し、PyTorch モデルに組み込み",
            "第87回 応用物理学会 秋季学術講演会で発表、2チーム体制の代表として研究を推進",
        ],
        details: `### Motivation
LTEM は p-n 接合や欠陥の空間分布を可視化できる強力なツールですが、現状は専門家が波形を目視で確認し、内部電場の向きや相対的な強さを定性的に判断するにとどまっています。これを「E₀ が30%低下」「W_dep が0.2μm縮んだ」と定量的に抽出できれば、LTEM は視覚ツールから検査プラットフォームへと変わります。

### Why ML?
THz 波形は半導体内部の約20,000個のキャリア軌跡を空間積分・時間微分した結果であり、逆問題は解析的に閉じません。異なるパラメータの組み合わせがピーク振幅上で縮退し、推定できなくなる問題もありますが、波形全体には情報が分散しています。その非自明な特徴抽出に機械学習を用いています。

### System
C++ で書かれたオープンソースの Monte Carlo 半導体シミュレーターをフォークし、物理条件・制約条件を追加して、順問題（物性 → 波形）の合成データを生成しています。逆問題は、物理法則に反する推定にペナルティを課す物理制約付き損失を組み込んだ PyTorch モデルで解いています。

### Presentation
第87回 応用物理学会 秋季学術講演会（2026）にて「テラヘルツ放射波形からの Physics-informed 機械学習によるドーピング密度の定量推定」を発表しました。

### Now
研究の発案者・代表として、機械学習チームとシミュレーションチームの2チーム体制で研究を進めています。

### Next
- 測定計画自体を最適化するアクティブラーニング
- Si 以外（ワイドギャップ材料など）への対象拡張`,
        images: [
            {
                src: "/research/test_sample_009.png",
                alt: "LTEM 測定データに基づく物性推定結果サンプル",
            },
        ],
    },
    {
        type: "Internship",
        title: "認証認可チーム — ログインフローにリスクベース認証を",
        short: "Auth / RBA",
        slug: "intern/auth-rba.md",
        signature: "risk( login ) → step-up auth",
        desc:
            "1ヶ月の長期インターンで認証認可チームに参加し、全ユーザーが通るログインフローの主要経路で、リスクベース認証（RBA）による追加認証の機能開発を行いました。",
        tech: ["Go", "gRPC", "Database", "認証認可", "RBA"],
        achievements: [
            "ログインフロー主要経路で、リスクベース認証の追加認証機能を開発",
            "大規模システムで「壊さない実装」を実践",
            "保守運用まで含め、プロダクトのライフサイクルを考える視点を獲得",
            "Go / gRPC / データベースを実務で習得",
        ],
        details: `### Protecting the Product
全ユーザーが通るログインフローは、壊れた瞬間にプロダクト全体が止まる場所です。大規模システムの中で「壊さない実装」を前提に、**プロダクトを守り、より強くしていく開発**に責任を持って取り組みました。

### Technology-Driven Engineering
これまでの経験はユーザーの課題から出発するものが中心でしたが、ここではユーザー目線から少し離れ、セキュリティと信頼性という技術ドリブンの世界で、プロダクトを良くしていくエンジニアリングを経験しました。

### Product as a Living Thing
保守運用まで含めて、プロダクトをライフサイクルを持つ生き物として考える視点を学びました。Go / gRPC によるサービス開発と、データベースまわりも実地で学べました。`,
        visual: "auth",
    },
    {
        type: "Internship",
        title: "Pineal — 採用面接AIの評価基盤を設計",
        short: "Pineal",
        slug: "intern/pineal.md",
        signature: "quality = auto_checks + human_review",
        desc:
            "採用面接AIシステムの開発で、LLM が生成する評価・帳票の品質を「感覚」ではなく説明可能にする評価基盤を設計しました。",
        tech: ["Python", "LLM評価", "Vertex AI"],
        achievements: [
            "PII 制約を起点に評価基盤を設計し ADR 化",
            "機械検査と人手レビューの分担を整理し、品質を説明可能な形に",
        ],
        details: `### The Problem
プロンプトを改善しても、その品質を「良くなりました」と感覚で伝えるしかない状態でした。何をもって合格とするかを顧客と握れる、説明可能な評価の仕組みが必要でした。

### Architecture
候補者情報（PII）を外部 SaaS に送れないという制約を起点に、機械検査と人手レビューの分担を整理した評価の仕組みを提案し、ADR として文書化しました。`,
        visual: "pineal",
    },
];
