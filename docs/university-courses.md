# 名校课程：重点与先修

在原有[优质课程链接](course-links.md)之外，继续补充 **7 所大学的 12 门课程**：MIT、Stanford、UC Berkeley、ETH Zürich、EPFL、Carnegie Mellon 和 UIUC。按你关注的集成电路、微电子与信息通信方向组织，先看内容与基础是否匹配，再决定学哪门。

[打开讲义笔记与历年试卷](course-materials.md){ .md-button .md-button--primary }
[模拟与混合信号](#analog){ .md-button }
[数字 IC 与体系结构](#digital){ .md-button }
[MEMS 与微系统](#mems){ .md-button }
[通信、DSP 与优化](#communications){ .md-button }
[先修自查与顺序](#readiness){ .md-button }

核对日期：**2026-10-26**。下文“课程重点”依据学校或教师大纲整理；“本站开课自查”是帮助自学的建议，不是学校入学资格。官方明确列出的先修会单独说明。**难度与小时数是本站对指定选学范围的估算**，含练习和复盘，不等于官方课时或完整项目投入。未公开全部材料的课程，也会如实标注。

## 先选一门 { #overview }

| 课程 | 最值得学的部分 | 难度 / 建议投入 | 材料状态 |
| --- | --- | --- | --- |
| [Berkeley EE140 / 240A](#berkeley-ee140) | 多级放大器、反馈稳定性与补偿 | 进阶 · 80–140 小时 | 2025 春课程站有讲义、作业和实验链接 |
| [Stanford EE214B](#stanford-ee214b) | CMOS 紧凑建模、噪声、gm/ID 与反馈 | 进阶 · 60–100 小时 | 官方课程介绍；未确认完整公开课包 |
| [EPFL EE-320](#epfl-ee320) | 晶体管级模拟模块与 OTA | 基础至进阶 · 50–90 小时 | 官方大纲，教学材料从 Moodle 进入 |
| [Berkeley EECS151 / 251A](#berkeley-eecs151) | RTL、验证、流水线及 ASIC / FPGA 流程 | 进阶 · 90–150 小时 | 2026 秋课程站及实验指导；工具有权限要求 |
| [ETH VLSI 2](#eth-vlsi2) | 从网表到 SoC 版图与时序收敛 | 进阶 · 90–150 小时 | 2026 春官方大纲；未确认完整公开实验包 |
| [EPFL EE-429](#epfl-ee429) | CMOS 延迟、功耗、SRAM 与半定制流程 | 进阶 · 70–120 小时 | 官方大纲公开，Moodle 课程拒绝访客访问 |
| [CMU 18-447](#cmu-18447) | 处理器、流水线、存储层次和性能分析 | 进阶 · 80–140 小时 | 已找到 2024 春公开讲义；试卷状态见资料页 |
| [MIT 6.777J](#mit-6777) | MEMS 工艺、机电建模、传感与反馈 | 进阶 · 70–120 小时 | 2007 春 OCW 讲义、习题、部分解答及项目 |
| [Stanford EE359](#stanford-ee359) | 衰落、容量、分集及多天线无线链路 | 进阶 · 80–130 小时 | 2020 冬课程站，列有讲义、作业及考试栏目 |
| [Berkeley EE123](#berkeley-ee123) | FFT、滤波器、多速率与信号实现 | 基础至进阶 · 70–120 小时 | 2026 春课程站列有讲义、作业；视频在 bCourses |
| [UIUC ECE453](#uiuc-ece453) | 射频接收机、匹配、噪声与无线系统实验 | 进阶 · 60–100 小时 | 2025 秋课程站有 Notes / Homework / Labs 入口 |
| [Stanford EE364A](#stanford-ee364a) | 凸建模、对偶、最优性与数值求解 | 进阶 · 70–120 小时 | 当前讲义与在线教材、SEE 归档视频和练习 |

这些课程与原有材料有知识交叉，可按薄弱点替换或补充，不需要把相近课程重复学完。上表中的“有链接”不保证每个文件、视频或实验环境都向校外开放。

## 模拟与混合信号 { #analog }

### Berkeley EE140 / 240A · 模拟集成电路 { #berkeley-ee140 }

**课程重点：**从 MOS 小信号模型走向电流镜、差分对和多级运放；重点理解频率响应、反馈稳定性、补偿与偏置，并接触开关电容、比较器等模块。适合把“会分析单管”推进到“能解释一整个放大器”。

- **官方先修：**[课程目录](https://www2.eecs.berkeley.edu/Courses/EE140/)列出 ELENG 105。自学时可先完成本站[器件与微电子电路](courses/ee-devices.md)及[模拟电子电路](courses/ee-analog.md)相关基础。
- **本站开课自查：**能求 MOS 静态工作点、画小信号等效电路、估算共源级增益，并读懂 Bode 图。不会这些时先补基础，不急于做补偿设计。
- **选学投入：**80–140 小时，覆盖主要放大器与反馈章节、代表性题目和一个缩小范围的仿真实验；不含整套课程项目。
- **材料与练习：**[2025 春课程站](https://people.eecs.berkeley.edu/~pister/140sp25/)按周链接讲义、HW、Lab 和历史试卷。公开材料供自学，讨论与成绩系统仍需课程权限。

[讲义笔记、试题与答案 →](course-materials.md#berkeley-ee140)

### Stanford EE214B · 高级集成电路设计 { #stanford-ee214b }

**课程重点：**用紧凑模型抓住先进 CMOS 的性能限制；包含噪声分析、gm/ID 尺寸设计、反馈电路，以及数字门延迟和逻辑努力。它要求从器件参数解释设计取舍，不能只记拓扑。

- **本站建议先修：**模拟 IC 基础、MOS 工作区与小信号模型、频率响应和负反馈；会使用 SPICE 检查工作点与交流响应。
- **本站开课自查：**能说明增加偏置电流对 gm、带宽与功耗的影响，并能分析一个差分放大器的增益和主要极点。
- **选学投入：**60–100 小时，限定噪声、gm/ID 与反馈专题阅读和小型仿真；完整学习所需资料需自行核对。
- **入口与限制：**[Stanford 官方课程介绍](https://bulletin.stanford.edu/courses/1038621)。本次未确认完整公开讲义、题库或视频，适合先确定进阶目标；需要立即练习可用上方 EE140 的公开材料。

[讲义笔记、试题与答案 →](course-materials.md#stanford-ee214b)

### EPFL EE-320 · Analog IC Design { #epfl-ee320 }

**课程重点：**从 MOS 大、小信号模型与寄生效应入手，学习单级放大器、电流镜、差分对、cascode、OTA、频率响应及模拟版图。重点是把复杂电路拆成可分析的小模块。

- **官方建议先修：**Electronics I、II，见[课程大纲](https://edu.epfl.ch/coursebook/en/analog-ic-design-EE-320)。
- **本站开课自查：**能用 KCL / KVL 分析电路，判断 MOS 饱和区，估算 gm 与输出电阻，并完成一次简单 SPICE 扫描。相关基础见[电路](courses/ee-circuits.md)与[器件指南](courses/ee-devices.md)。
- **选学投入：**50–90 小时，核心模拟模块与一项 OTA 分析；不含全部 CAD 与版图实验。
- **练习与权限：**大纲说明有习题、作业和 CAD 实践，[教学平台入口](https://go.epfl.ch/EE-320)可能要求课程账号；未确认完整题目公开。校外自学可用 EE140 作业补相近主题。

[讲义笔记、试题与答案 →](course-materials.md#epfl-ee320)

## 数字 IC 与体系结构 { #digital }

### Berkeley EECS151 / 251A · 数字设计与集成电路 { #berkeley-eecs151 }

**课程重点：**从 HDL、状态机、验证和 RISC-V 数据通路，推进到流水线、CMOS 门延迟与物理设计。实验分 ASIC 与 FPGA 两条路线，适合建立“代码如何变成可验证硬件”的完整认识。

- **官方先修：**[课程目录](https://www2.eecs.berkeley.edu/Courses/EECS151/)当前列出 ELENG 66 与 ELENG 64；实际选课还要求并修相应实验。
- **本站开课自查：**会组合 / 时序逻辑、寄存器和有限状态机，能写并仿真小型 RTL；掌握 Linux、Git 与基本脚本。基础薄弱可先练[HDLBits](courses/ic-hdlbits.md)。
- **选学投入：**90–150 小时，核心讲义、入门实验和一个小模块的验证 / 综合；不含完整处理器或整芯片项目。
- **材料与练习：**[2026 秋课程站](https://eecs151.org/)列出 HW 与实验；[ASIC Lab 1](https://eecs151.org/asic/lab1/overview/)可作为流程起点。实验服务器、工具许可与正式验收按原课权限安排，不能仅凭公开指导运行全部实验。

[讲义笔记、试题与答案 →](course-materials.md#berkeley-eecs151)

### ETH Zürich · VLSI 2：从网表到完整 SoC { #eth-vlsi2 }

**课程重点：**由前端设计复习进入标准单元、布局规划、I/O 与封装、时钟、寄生、布局布线、功耗和测试。官方说明自 2025 年起更侧重开源工具与实践，目标是围绕练习完成 SoC 设计。

- **官方先修：**VLSI I 或同等知识；明确要求数字电路设计、HDL 与时序基础。见[2026 春官方大纲](https://www.vvz.ethz.ch/Vorlesungsverzeichnis/lerneinheit.view?ansicht=KATALOGDATEN&lang=en&lerneinheitId=199376&semkez=2026S)。
- **本站开课自查：**能从 RTL 得到综合网表，解释 setup / hold、关键路径与约束，读懂基本时序报告。可先学习[数字 IC](courses/ic-digital.md)和[OpenROAD 实践](courses/ic-eda.md)。
- **选学投入：**90–150 小时，后端基础与缩小范围的模块流程；完整 SoC 项目另计。
- **材料与加入：**官方大纲链接课程站，但本次未确认完整公开实验包；该学期正式选课要求提交动机说明并经课程方审核，不是公开邀请码选课。校外可先按本站 OpenROAD 指南做独立练习。

[讲义笔记、试题与答案 →](course-materials.md#eth-vlsi2)

### EPFL EE-429 · Fundamentals of VLSI Design { #epfl-ee429 }

**课程重点：**CMOS 反相器与逻辑门、逻辑努力、互连寄生与 Elmore 延迟、动态 / 漏电功耗、SRAM，以及标准单元和 RTL 到版图流程。适合把逻辑功能与晶体管尺寸、时序和功耗联系起来。

- **官方建议先修：**EE-334 Digital System Design，可同学期并行，见[官方大纲](https://edu.epfl.ch/coursebook/en/fundamentals-of-vlsi-design-EE-429)。
- **本站开课自查：**掌握布尔逻辑、时序电路、基本 RTL，了解 MOS 开关模型与 RC 充放电，能解释增大门尺寸的收益与负担。
- **选学投入：**70–120 小时，门级分析、存储基础与一个缩小流程练习，不含完整工业工具项目。
- **练习与权限：**大纲含计算机实验和工业工具；[Moodle 课程入口](https://go.epfl.ch/EE-429)要求课程权限，核对时不允许访客进入。可搭配本站[CMOS 数字 IC 指南](courses/ic-digital.md)的 MIT 公开作业。

[讲义笔记、试题与答案 →](course-materials.md#epfl-ee429)

### Carnegie Mellon 18-447 · 计算机体系结构 { #cmu-18447 }

**课程重点：**处理器控制与数据通路、流水线、简单超标量执行、存储层次和性能分析；官方介绍包含用 Verilog 设计与仿真处理器的实验，强调用实现检验架构选择。

- **官方先修：**[课程目录](https://courses.ece.cmu.edu/18447)列出 18-240、18-213，以及指定 18-3xx 课程之一；介绍明确要求 RTL 系统、缓存 / 虚拟内存与汇编知识。
- **本站开课自查：**能读简单汇编、画数据通路、解释流水线冒险，写基础 Verilog；具备 C 编程和调试能力。可从[数字逻辑指南](courses/ee-digital.md)与[原有 Cornell 课程](course-links.md#cornell-ece4750)衔接。
- **选学投入：**80–140 小时，核心结构分析和一个缩小的流水线 / 缓存实验；不含整套处理器项目。
- **材料更新：**已进一步找到教师官网的 2024 春公开讲义，并抓取前六讲，见下方资料页；当前学期实验与试卷权限仍按原校要求。也可参考[已有体系结构实验入口](course-practice.md#cornell-ece4750)。

[讲义笔记、试题与答案 →](course-materials.md#cmu-18447)

## MEMS 与微系统 { #mems }

### MIT 6.777J · 微机电器件设计与制造 { #mit-6777 }

**课程重点：**把微加工工艺、材料与结构力学、集中参数建模、传感 / 驱动和电子读出连起来；涉及电容 / 压阻传感、静电驱动、阻尼、噪声与反馈。适合想从微电子扩展到传感器和微系统的人。

- **官方背景说明：**[2007 春大纲](https://ocw.mit.edu/courses/6-777j-design-and-fabrication-of-microelectromechanical-devices-spring-2007/pages/syllabus/)说明有加工经验更理想，课程跨越力学、电磁和电路；不将历史课程号当作现行报名规则。
- **本站开课自查：**会微积分、微分方程、弹簧质量系统、电容与静电能量、基础电路和反馈；先了解[微纳加工](courses/ic-process.md)，再练习由结构图推导等效模型。
- **选学投入：**70–120 小时，工艺与建模重点、代表性习题及一个传感器模型；不包含洁净室加工与完整团队项目。
- **公开材料：**[OCW 课程](https://ocw.mit.edu/courses/6-777j-design-and-fabrication-of-microelectromechanical-devices-spring-2007/) · [作业与部分解答](https://ocw.mit.edu/courses/6-777j-design-and-fabrication-of-microelectromechanical-devices-spring-2007/pages/assignments/)。归档材料用于自学，无原校在线评分。

[讲义笔记、试题与答案 →](course-materials.md#mit-6777)

## 通信、DSP 与优化 { #communications }

### Stanford EE359 · 无线通信 { #stanford-ee359 }

**课程重点：**围绕无线信道与链路性能，学习传播与衰落、容量、调制、分集、多天线及多载波等主题，范围可查[官方课程介绍](https://bulletin.stanford.edu/courses/1040291/tab-aoYks)。重点是理解随机信道怎样改变误码率和容量。

- **官方先修：**[2020 冬课程说明](https://web.stanford.edu/class/ee359/courseinfo.html)要求 EE279 或同等背景，或教师同意；[EE279 官方介绍](https://bulletin.stanford.edu/courses/1039191)对应数字通信，并使用概率、随机过程、线性代数和傅里叶分析。
- **本站开课自查：**能解释 AWGN 下的检测和误码率，理解随机变量、期望、功率谱及复基带表示；先学[通信原理](courses/comm-principles.md)和[概率基础](courses/ee-probability.md)。
- **选学投入：**80–130 小时，核心链路理论、代表性推导和一个衰落信道仿真；不含完整项目。
- **材料与练习：**[2020 课程站](https://web.stanford.edu/class/ee359/courseinfo.html)导航列有 Lectures、Homework、Projects、Exams。归档日期不代表当前提交窗口，部分文件可能受权限限制。

[讲义笔记、试题与答案 →](course-materials.md#stanford-ee359)

### Berkeley EE123 · 数字信号处理 { #berkeley-ee123 }

**课程重点：**DTFT / Z 变换、DFT / FFT、频谱分辨率、卷积实现、FIR 设计、多速率、滤波器组及量化；大纲还涉及小波、压缩感知与二维信号。重点在算法如何实现及其误差与取舍。

- **官方先修：**[2026 春课程站](https://sites.google.com/berkeley.edu/ee123-sp26/home)列出 EECS120 或教师许可。
- **本站开课自查：**能计算卷积与系统频率响应，理解采样、混叠和复指数；会用 Python / NumPy 绘图、FFT 与调试 Jupyter Notebook。信号基础可先看[本站指南](courses/ee-signals.md)。
- **选学投入：**70–120 小时，FFT、滤波与采样重点和一个数值实验，不含全部扩展主题。
- **练习与提交：**课程站列有讲义、HW 与编程实验安排，外链文件权限以原站为准；视频在 bCourses，作业正式提交通过 Gradescope，需要课程权限。公开自测也可搭配[MIT DSP 作业](course-practice.md#zju-dsp)。

[讲义笔记、试题与答案 →](course-materials.md#berkeley-ee123)

### UIUC ECE453 · 无线通信系统 { #uiuc-ece453 }

**课程重点：**由射频电路进入完整无线系统，包括接收机、匹配、天线与接收噪声、调制、高频电路和链路。适合把通信原理与真实硬件、仪器测量联系起来。

- **官方先修：**[学校课程目录](https://ece.illinois.edu/academics/courses/ECE453)要求 ECE329，且 ECE342 需已学或同时修读。
- **本站开课自查：**掌握电磁场与传输线基础、晶体管放大器和频率响应，能做阻抗匹配、读 dB / dBm 并估算噪声。先修入口：[电磁场](courses/ee-em.md)、[模电](courses/ee-analog.md)。
- **选学投入：**60–100 小时，接收、匹配与噪声分析，选做预习 / 仿真；不含整套仪器实验与硬件项目。
- **材料与实验：**[2025 秋课程站](https://courses.grainger.illinois.edu/ece453/fa2025/index.htm)有 Notes、Homework、Labs 等入口；硬件实验需相应设备，完整文件与正式提交权限依课程要求。

[讲义笔记、试题与答案 →](course-materials.md#uiuc-ece453)

### Stanford EE364A · 凸优化 I { #stanford-ee364a }

**课程重点：**识别凸问题、构造模型，学习凸集 / 函数、线性与二次规划、最优性条件、对偶和内点法。对通信资源分配、滤波器设计与部分电路设计问题都有帮助，但不是所有无线或 IC 优化都能直接写成凸问题。

- **官方先修：**[当前课程页](https://web.stanford.edu/class/ee364a/)要求扎实的线性代数、概率与基础 Python，并使用 CVXPY；数值计算经验有帮助。
- **本站开课自查：**能处理矩阵、二次型、特征值和向量求导，会最小二乘及基本概率，能用 Python 写一个数值求解脚本。矩阵基础可结合[EE263](course-links.md#stanford-ee263)补齐。
- **选学投入：**70–120 小时，凸建模、对偶与代表性题目，另复现一个小型优化实例；不含全部算法细节和作业。
- **公开材料与提交：**当前页面提供讲义与在线教材；[SEE 归档课程](https://see.stanford.edu/Course/EE364A)提供自学视频与作业栏目。当前班级的 Ed / Gradescope 使用课程权限，归档自学无需邀请码。

[讲义笔记、试题与答案 →](course-materials.md#stanford-ee364a)

## 先修自查与衔接顺序 { #readiness }

下面是本站按知识依赖提出的学习建议，不是学校官方等效课程认定。

| 想走的方向 | 提前掌握的知识 | 建议衔接 | 一个准备度检查 |
| --- | --- | --- | --- |
| 模拟 IC | 电路、器件、模电、频率响应、反馈、SPICE | EE105 / 本站器件基础 → EE140 或 EPFL EE-320 → EE214B | 独立分析一个共源级，并对照交流仿真解释主极点 |
| 数字 IC / 后端 | 数字逻辑、RTL、验证、Linux、时序约束 | HDLBits → EECS151 核心与一种实验路线 → ETH VLSI 2；EE-429 补晶体管级分析 | 写一个 FSM / FIFO 的测试，能解释综合与时序报告 |
| 体系结构 | 数字系统、汇编、缓存、流水线、基本 C / HDL | 数字逻辑基础 → CMU 18-447 或 Cornell ECE4750 | 解释数据冒险，并画出停顿或转发的过程 |
| 无线与 DSP | 信号、概率、随机过程、数字通信、数值编程 | EE123 补实现 → 通信原理 → EE359；硬件分支另走 ECE453 | 复现 AWGN 误码率或混叠现象，解释每个参数 |
| 通信优化 | 线性代数、概率、微积分、Python | EE263 基础 → EE364A → 对应方向的小型优化模型 | 判断约束是否凸，并解释求解结果与残差 |
| MEMS / 传感器 | 微积分、力学、电磁、电路、工艺 | 微纳加工基础 → MIT 6.777J | 给电容式传感器建立机械与电读出的简化模型 |

选学时每个方向先保留一门主课，其他课程作为专题查阅。把作业题号和实验目标记到[工作台](dashboard.md)，练习及班级权限问题可继续查看[习题与提交](course-practice.md)。

[返回优质课程链接](course-links.md){ .md-button }
[查看基础课程目录](catalog.md){ .md-button }
