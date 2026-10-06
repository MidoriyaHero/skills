# skills

Personal collection of Cursor / Claude agent skills. Each folder holds a `SKILL.md` (plus optional `reference/`, `scripts/`, `template/`) that the agent loads when the task matches.

## Install

```bash
git clone git@github.com:MidoriyaHero/skills.git ~/.cursor/skills
```

Templates with a `package.json` (e.g. `gen-motion-video/template`) need `npm install` before first use; `node_modules/` is not committed.

## Skills by topic

### Video & motion graphics
| Skill | What it does |
|---|---|
| `gen-motion-video` | Remotion videos from real product assets: showreel, teaser, explainer, logo sting, footage enhance |
| `short-motion-video` | 20 s product showreel (kinetic hook, UI build, cursor-driven features, proof, outro) |
| `remotion-motion-graphics` | General Remotion motion-graphics creation and editing |
| `sora` | Generate, edit, extend and manage Sora videos |
| `audio-mixer-assistant` | Mix voice, music, and effects to platform loudness targets |
| `script-to-teleprompter` | Turn scripts into teleprompter copy with delivery cues and timing |
| `subtitle-generator-pro` | Timed captions in creator styles (SRT, ASS, VTT) |
| `thumbnail-designer` | High-CTR YouTube and social thumbnail concepts |
| `video-editor-ai` | Edit raw recordings: silence, pacing, color, multi-platform export |

### UI/UX & visual design
| Skill | What it does |
|---|---|
| `frontend-design` | Aesthetic direction, typography and intentional UI choices |
| `hallmark` | Anti-AI-slop design for new pages, audits, redesigns, design extraction |
| `ui-ux-pro-max` | UI/UX design system with style, palette and font data |
| `landing-page-guide-v2` | High-converting, well-designed landing pages |
| `tufte-data-viz` | Charts and dashboards following Tufte principles |

### Frontend web
| Skill | What it does |
|---|---|
| `react-expert` | React 18+ components, hooks, state |
| `nextjs-developer` | Next.js 14+ App Router, server components and actions |
| `vue-expert` | Vue 3 + TypeScript, Nuxt 3, Pinia |
| `vue-expert-js` | Vue 3 with plain JavaScript |
| `angular-architect` | Angular 17+ standalone components, NgRx, RxJS |
| `javascript-pro` | Modern ES2023+ and Node.js |
| `typescript-pro` | Advanced type systems, tRPC |

### Mobile
| Skill | What it does |
|---|---|
| `flutter-expert` | Flutter 3 / Dart, Riverpod, GoRouter |
| `react-native-expert` | React Native and Expo |
| `swift-expert` | iOS/macOS with SwiftUI |
| `kotlin-specialist` | Kotlin coroutines, Flow, Compose, multiplatform |

### Backend frameworks
| Skill | What it does |
|---|---|
| `fastapi-expert` | Async Python APIs with FastAPI + Pydantic v2 |
| `django-expert` | Django and Django REST Framework |
| `nestjs-expert` | NestJS modules, guards, DTOs |
| `rails-expert` | Rails 7+, Active Record, Turbo |
| `laravel-specialist` | Laravel 10+, Eloquent, Sanctum, Horizon |
| `php-pro` | Modern PHP 8.3+, Symfony, strict typing |
| `spring-boot-engineer` | Spring Boot 3, Security 6, Data JPA |
| `java-architect` | Enterprise Java, microservices, reactive |
| `dotnet-core-expert` | .NET 8 minimal APIs, clean architecture, EF Core |
| `csharp-developer` | C# / ASP.NET Core / Blazor |

### Languages & systems
| Skill | What it does |
|---|---|
| `python-pro` | Typed, async Python 3.11+ |
| `golang-pro` | Go concurrency, gRPC, microservices |
| `rust-engineer` | Idiomatic, memory-safe Rust |
| `cpp-pro` | Modern C++20/23, high-performance code |
| `embedded-systems` | Firmware, RTOS, STM32/ESP32 |
| `game-developer` | Unity/Unreal systems, ECS, game performance |

### APIs, protocols & tooling
| Skill | What it does |
|---|---|
| `api-designer` | REST/GraphQL API design, OpenAPI specs |
| `graphql-architect` | GraphQL schemas, Federation, subscriptions |
| `websocket-engineer` | Real-time WebSocket / Socket.IO systems |
| `mcp-developer` | Build and debug MCP servers and clients |
| `cli-developer` | CLI tools, argument parsing, interactive prompts |

### Platforms & integrations
| Skill | What it does |
|---|---|
| `wordpress-pro` | WordPress themes, plugins, Gutenberg, WooCommerce |
| `shopify-expert` | Shopify themes, apps, Storefront API |
| `salesforce-developer` | Apex, Lightning Web Components, SOQL |
| `atlassian-mcp` | Jira and Confluence via MCP |

### Data & databases
| Skill | What it does |
|---|---|
| `sql-pro` | SQL queries, schema design, performance |
| `postgres-pro` | PostgreSQL tuning, replication, JSONB |
| `database-optimizer` | Slow-query and execution-plan analysis (Postgres/MySQL) |
| `pandas-pro` | DataFrame cleaning, aggregation, transformation |
| `spark-engineer` | Apache Spark jobs and cluster tuning |

### AI / ML
| Skill | What it does |
|---|---|
| `rag-architect` | Production RAG: chunking, embeddings, hybrid search |
| `fine-tuning-expert` | LLM fine-tuning with LoRA/QLoRA |
| `ml-pipeline` | MLflow/W&B tracking, Kubeflow/Airflow pipelines |
| `prompt-engineer` | Prompt templates, structured outputs, evals |
| `roboflow-computer-vision` | Roboflow training, evaluation, inference, deployment |

### Architecture
| Skill | What it does |
|---|---|
| `architecture-designer` | High-level system design, ADRs, diagrams |
| `microservices-architect` | Service boundaries, communication patterns |
| `cloud-architect` | AWS/Azure/GCP design, migration, cost, DR |
| `legacy-modernizer` | Incremental migration from legacy systems |

### DevOps, infrastructure & reliability
| Skill | What it does |
|---|---|
| `devops-engineer` | Dockerfiles, CI/CD, deployment automation |
| `kubernetes-specialist` | Kubernetes manifests, security, networking |
| `terraform-engineer` | Terraform modules and state across clouds |
| `monitoring-expert` | Logging, Prometheus/Grafana, alerting, tracing |
| `sre-engineer` | SLOs, error budgets, incident response |
| `chaos-engineer` | Failure injection and game-day exercises |

### Security
| Skill | What it does |
|---|---|
| `secure-code-guardian` | Auth, input validation, OWASP Top 10 prevention |
| `security-reviewer` | Vulnerability audits with severity and remediation |
| `fullstack-guardian` | Security-first full-stack feature implementation |

### Code quality, testing & debugging
| Skill | What it does |
|---|---|
| `code-reviewer` | Bugs, security issues and smells in diffs |
| `test-master` | Test files, mocking, coverage, test plans |
| `debugging-wizard` | Hypothesis-driven debugging from errors and logs |
| `playwright-expert` | Playwright E2E test suites |
| `playwright` | Terminal browser automation, screenshots, scraping |
| `playwright-interactive` | Persistent browser/Electron session for UI debugging |
| `screenshot` | Desktop, window or region screenshots |

### Simplicity (ponytail family)
| Skill | What it does |
|---|---|
| `ponytail` | Force the simplest solution that works (YAGNI, stdlib first) |
| `ponytail-review` | Review a diff for over-engineering |
| `ponytail-audit` | Whole-repo over-engineering audit |
| `ponytail-debt` | Collect `ponytail:` shortcut comments into a debt ledger |
| `ponytail-gain` | Show ponytail's measured impact |
| `ponytail-help` | Quick reference for ponytail commands |

### Planning, specs & documentation
| Skill | What it does |
|---|---|
| `feature-forge` | Requirements workshops, user stories, acceptance criteria |
| `spec-miner` | Reverse-engineer specs from existing code |
| `code-documenter` | Docstrings, OpenAPI, JSDoc, user guides |
| `the-fool` | Devil's advocate, pre-mortems, red-teaming plans |

### Office documents
| Skill | What it does |
|---|---|
| `doc` | Read/create/edit `.docx` |
| `pdf` | Read/create/review PDFs with visual checks |
| `slides` | Build `.pptx` decks with PptxGenJS |
| `spreadsheet` | Create/edit/analyse `.xlsx`, `.csv`, `.tsv` |
