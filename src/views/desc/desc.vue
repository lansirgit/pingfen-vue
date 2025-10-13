<template>
  <div class="competition-container">
    <div class="content">
      <div class="top-container">
        <el-page-header @back="goBack" content="赛事说明"></el-page-header>
      </div>

      <div class="main-content">
        <!-- 头部横幅 -->
        <div class="header-banner">
          <div class="banner-content">
            <h1 class="competition-title">中国解剖学会首届AI应用能力大赛</h1>
            <div class="competition-theme">
              <el-tag type="success" class="theme-tag">智启解剖·AI赋能教与学</el-tag>
            </div>
          </div>
        </div>

        <!-- 大赛信息概览 -->
        <div class="overview-section">
          <el-row :gutter="20">
            <el-col :span="12" :xs="24">
              <div class="overview-card">
                <div class="card-icon">
                  <i class="el-icon-medal"></i>
                </div>
                <div class="card-content">
                  <h3>主办单位</h3>
                  <p>中国解剖学会</p>
                </div>
              </div>
            </el-col>
            <el-col :span="12" :xs="24">
              <div class="overview-card">
                <div class="card-icon">
                  <i class="el-icon-s-custom"></i>
                </div>
                <div class="card-content">
                  <h3>承办单位</h3>
                  <p>中山大学医学院（深圳）和 广东省解剖学会</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 赛道分类 -->
        <div class="tracks-section">
          <div class="section-header">
            <h2>比赛赛道</h2>
            <div class="section-divider"></div>
          </div>
          
          <el-tabs type="border-card" class="tracks-tabs">
            <el-tab-pane label="教师赛道">
              <div class="projects-grid">
                <el-card 
                  class="project-card" 
                  v-for="project in teacherProjects" 
                  :key="project.id"
                >
                  <div class="project-header">
                    <h3 class="project-title">{{ project.name }}</h3>
                    <el-tag type="success" size="small">{{ getProjectFileType(project) }}</el-tag>
                  </div>
                  <div class="project-description">
                    <p>{{ project.description }}</p>
                  </div>
                  <div class="project-icon">
                    <i :class="getProjectIcon(project)"></i>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="学生赛道">
              <div class="projects-grid">
                <el-card 
                  class="project-card" 
                  v-for="project in studentProjects" 
                  :key="project.id"
                >
                  <div class="project-header">
                    <h3 class="project-title">{{ project.name }}</h3>
                    <el-tag type="primary" size="small">{{ getProjectFileType(project) }}</el-tag>
                  </div>
                  <div class="project-description">
                    <p>{{ project.description }}</p>
                  </div>
                  <div class="project-icon">
                    <i :class="getProjectIcon(project)"></i>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 参赛规则 -->
        <el-card class="section-card rules-card">
          <div slot="header" class="card-header">
            <i class="el-icon-document-checked"></i>
            <span>参赛规则</span>
          </div>
          <div class="card-content">
            <el-timeline>
              <el-timeline-item
                v-for="(rule, index) in rules"
                :key="index"
                :timestamp="'0' + (index + 1)"
                placement="top"
                color="#409EFF">
                <el-card class="rule-card">
                  <p>{{ rule }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>

        <!-- 底部装饰 -->
        <div class="footer-decoration">
          <div class="decoration-line"></div>
          <p class="footer-text">期待您的精彩作品</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompetitionInfo',
  data() {
    return {
      projects: [
        {
          "description": "利用 AI 工具（如 DeepSeek、文心一言、腾讯元宝等）创作与人体解剖学知识相关的诗歌，需兼具科学准确性与文学感染力。\n线上提交作品及格式要求：①诗歌文本；②创作思路和过程的说明（通过 AI 调整韵律、意象与知识点结合），必须包含 AI 工具使用说明（思维导图需标注工具+功能+应用场景）。③要求：合成一个 PDF 文档上传",
          "entry_types": [
            {
              "alias": "PDF",
              "description": ".pdf",
              "id": 5,
              "type": "pdf"
            }
          ],
          "id": 4,
          "name": "AI 辅助人体解剖学教学诗歌创作",
          "track": "教师赛道"
        },
        {
          "description": "以 AI 文生图、文生文技术创作人体解剖学发展史可视化作品，可选形式：动态 PPT、微课视频、互动网页。\n线上提交作品及格式要求：①总时长 4-5 分钟的视频；②视频内容可部分选用自备素材，总视频 AI 生成画面，AI 生成文字不少于 50%；③作品大小不超过 100M。",
          "entry_types": [
            {
              "alias": "视频",
              "description": ".mp4,.mpg",
              "id": 1,
              "type": "video"
            }
          ],
          "id": 5,
          "name": "AI 辅助人体解剖学发展人文故事创作",
          "track": "教师赛道"
        },
        {
          "description": "根据知识点，使用 AI 工具（如 AIPPT、Gamma、通义千问等）制作交互式课件。\n线上提交作品及格式要求：①PPT 课件源文件；②上传作品大小不超过 100M",
          "entry_types": [
            {
              "alias": "PPT",
              "description": ".ppt,.pptx",
              "id": 7,
              "type": "ppt"
            }
          ],
          "id": 6,
          "name": "解剖学 AI 智能课件设计",
          "track": "教师赛道"
        },
        {
          "description": "利用 AI 工具（如勤秘等）生成个性化教案，教案包含：学情分析报告（如学生知识点掌握图示）、AI 驱动的教学策略建议。\n复赛线上提交作品及格式要求：①生成的教案文档；②AI 分析报告截图和教学实践效果数据（如课堂测验对比）；③上述内容生成 PDF 上传，作品大小不超过 100M。",
          "entry_types": [
            {
              "alias": "PDF",
              "description": ".pdf",
              "id": 5,
              "type": "pdf"
            }
          ],
          "id": 7,
          "name": "AI 智能教案与学情分析",
          "track": "教师赛道"
        },
        {
          "description": "使用现有 AI 工具（如百度 AI 开放平台、腾讯云 AI 等），生成人体解剖学结构图谱，并标注结构名称。\n复赛线上提交作品及格式要求：①标注的解剖图片；②格式为.jpg。",
          "entry_types": [
            {
              "alias": "图片",
              "description": ".jpg",
              "id": 2,
              "type": "image"
            }
          ],
          "id": 8,
          "name": "AI 辅助解剖图谱生成及结构标注",
          "track": "学生赛道"
        },
        {
          "description": "基于 AI 工具（如剪映、即梦等）制作 2~3 分钟左右解剖学学习短视频（或动画）。视频包含：AI 生成动画、数字人讲解、知识点标注、互动问答设计等。\n复赛线上提交作品及格式要求：①短视频（或动画）；②格式为.mpg,作品大小不超过 100M",
          "entry_types": [
            {
              "alias": "视频",
              "description": ".mp4,.mpg",
              "id": 1,
              "type": "video"
            }
          ],
          "id": 9,
          "name": "AI 辅助学习短视频（动画）制作",
          "track": "学生赛道"
        },
        {
          "description": "使用任意 AI 工具结合自然语言处理技术，选择解剖学的一个知识点（如消化系统“胆囊”），构建解剖学知识图谱、思维导图。\n复赛线上提交作品及格式要求：①知识图谱(思维导图)；②格式转为.pdf,实现路径说明（200 字）PDF，作品大小不超过 100M。",
          "entry_types": [
            {
              "alias": "PDF",
              "description": ".pdf",
              "id": 5,
              "type": "pdf"
            }
          ],
          "id": 10,
          "name": "人体解剖学知识图谱、思维导图 AI 构建",
          "track": "学生赛道"
        },
        {
          "description": "针对特定人群设计 AI 科普产品，使用任意 AI 工具，选择一个指定的知识点（如消化系统：“麦氏点”与阑尾炎），生成科普作品，并进行 3 分钟讲解。可选形式包括科普视频、交互式网页、AI 课件，但必须包含用户画像和传播路径设计。\n赛线上提交作品及格式要求：①视频/交互网页/PPT 课件；②视频格式为.mpg,交互网页格式自定义,作品可打包（含实现路径说明），大小不超过 100M。",
          "entry_types": [
            {
              "alias": "压缩包",
              "description": ".zip,.rar",
              "id": 3,
              "type": "zip"
            },
            {
              "alias": "PPT",
              "description": ".ppt,.pptx",
              "id": 7,
              "type": "ppt"
            },
            {
              "alias": "视频",
              "description": ".mp4,.mpg",
              "id": 1,
              "type": "video"
            },
            {
              "alias": "网页",
              "description": ".html",
              "id": 4,
              "type": "web"
            }
          ],
          "id": 11,
          "name": "解剖学健康科普作品创作",
          "track": "学生赛道"
        }
      ],
      rules: [
        '参赛作品必须为原创，不得侵犯他人知识产权',
        '作品需紧扣解剖学主题，体现AI技术应用',
        '参赛者需按要求提交完整作品及相关材料',
        '评审将从创新性、实用性、技术难度等维度进行综合评价',
        '参赛即视为同意主办方拥有作品的使用权和宣传权'
      ]
    }
  },
  computed: {
    teacherProjects() {
      return this.projects.filter(project => project.track === "教师赛道");
    },
    studentProjects() {
      return this.projects.filter(project => project.track === "学生赛道");
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getProjectIcon(project) {
      const type = project.entry_types[0].type;
      const iconMap = {
        'pdf': 'el-icon-document',
        'video': 'el-icon-video-camera',
        'ppt': 'el-icon-present',
        'image': 'el-icon-picture-outline',
        'zip': 'el-icon-folder',
        'web': 'el-icon-link'
      };
      return iconMap[type] || 'el-icon-collection-tag';
    },
    getProjectFileType(project) {
      if (project.entry_types.length > 1) {
        return "多种格式";
      }
      return project.entry_types[0].alias;
    }
  }
}
</script>

<style lang="scss" scoped>
.competition-container {
  background: linear-gradient(135deg, #f0f4f8 0%, #e6f0ff 100%);
  min-height: calc(100vh - 61px);
  padding: 20px 0;

  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    .main-content {
      .header-banner {
        background: linear-gradient(120deg, #1e88e5 0%, #0d47a1 100%);
        border-radius: 16px;
        padding: 40px;
        margin: 30px 0;
        position: relative;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(30, 136, 229, 0.3);
        
        &::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          transform: rotate(30deg);
        }

        .banner-content {
          text-align: center;
          position: relative;
          z-index: 1;

          .competition-title {
            color: white;
            font-size: 32px;
            margin-bottom: 20px;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .competition-theme {
            .theme-tag {
              font-size: 20px;
              padding: 15px 30px;
              height: auto;
              background: rgba(255, 255, 255, 0.9);
              color: #0d47a1;
              border: none;
              font-weight: 600;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
          }
        }
      }

      .overview-section {
        margin-bottom: 30px;

        .overview-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          height: 100%;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }

          .card-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #409EFF 0%, #1e88e5 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            i {
              font-size: 28px;
              color: white;
            }
          }

          .card-content {
            h3 {
              color: #333;
              margin-bottom: 8px;
              font-size: 18px;
              font-weight: 600;
              text-align: left;
            }

            p {
              color: #666;
              font-size: 16px;
              line-height: 1.5;
            }
          }
        }
      }

      .tracks-section {
        margin-bottom: 30px;
        
        .section-header {
          text-align: center;
          margin-bottom: 20px;
          
          h2 {
            color: #333;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 15px;
          }
          
          .section-divider {
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #409EFF, #1e88e5);
            margin: 0 auto;
            border-radius: 2px;
          }
        }
        
        .tracks-tabs {
          border: none;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          border-radius: 16px;
          overflow: hidden;
          
          ::v-deep .el-tabs__header {
            background: #f8fafc;
            margin-bottom: 0;
            border-radius: 16px 16px 0 0;
          }
          
          ::v-deep .el-tabs__nav-wrap::after {
            background-color: transparent;
          }
          
          ::v-deep .el-tabs__item {
            height: 60px;
            line-height: 60px;
            font-size: 18px;
            font-weight: 500;
            color: #666;
            
            &.is-active {
              color: #409EFF;
              font-weight: 600;
            }
          }
          
          ::v-deep .el-tabs__content {
            padding: 25px;
            background: white;
            border-radius: 0 0 16px 16px;
          }
          
          .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
            
            .project-card {
              border-radius: 12px;
              border: 1px solid #e6f0ff;
              transition: all 0.3s ease;
              
              &:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(64, 158, 255, 0.2);
                border-color: #409EFF;
              }
              
              .project-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
                
                .project-title {
                  color: #333;
                  font-size: 18px;
                  font-weight: 600;
                  margin: 0;
                  flex: 1;
                  margin-right: 10px;
                }
              }
              
              .project-description {
                margin-bottom: 20px;
                
                p {
                  color: #666;
                  font-size: 14px;
                  line-height: 1.6;
                  white-space: pre-line;
                }
              }
              
              .project-icon {
                text-align: center;
                
                i {
                  font-size: 40px;
                  color: #409EFF;
                  opacity: 0.7;
                }
              }
            }
          }
        }
      }

      .section-card {
        margin-bottom: 30px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        border: none;

        .card-header {
          background: linear-gradient(90deg, #409EFF 0%, #1e88e5 100%);
          color: white;
          padding: 20px 30px;
          font-size: 20px;
          font-weight: 600;
          border: none;

          i {
            margin-right: 10px;
            font-size: 22px;
          }
        }

        .card-content {
          padding: 25px;
        }
      }

      .rules-card {
        .card-content {
          padding: 30px;

          ::v-deep .el-timeline {
            .el-timeline-item {
              .el-timeline-item__timestamp {
                color: #409EFF;
                font-weight: 600;
                font-size: 16px;
              }

              .el-timeline-item__tail {
                border-color: #409EFF;
              }

              .el-timeline-item__node {
                background: #409EFF;
                border-color: #409EFF;
              }

              .rule-card {
                border-radius: 12px;
                border: 1px solid #e6f0ff;
                transition: all 0.3s ease;

                &:hover {
                  border-color: #409EFF;
                  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.2);
                }

                p {
                  color: #555;
                  font-size: 16px;
                  line-height: 1.6;
                  padding: 15px;
                }
              }
            }
          }
        }
      }

      .footer-decoration {
        text-align: center;
        margin: 50px 0 30px;

        .decoration-line {
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, transparent, #409EFF, transparent);
          margin: 0 auto 20px;
          border-radius: 2px;
        }

        .footer-text {
          color: #666;
          font-size: 18px;
          font-weight: 500;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .competition-container {
    .content {
      padding: 0 15px;

      .main-content {
        .header-banner {
          padding: 30px 20px;

          .banner-content {
            .competition-title {
              font-size: 24px;
            }

            .competition-theme {
              .theme-tag {
                font-size: 16px;
                padding: 12px 20px;
              }
            }
          }
        }

        .overview-section {
          .el-row {
            flex-direction: column;

            .el-col {
              margin-bottom: 20px;
            }
          }

          .overview-card {
            padding: 20px;

            .card-icon {
              width: 50px;
              height: 50px;

              i {
                font-size: 24px;
              }
            }

            .card-content {
              h3 {
                font-size: 16px;
              }

              p {
                font-size: 14px;
              }
            }
          }
        }

        .tracks-section {
          .tracks-tabs {
            ::v-deep .el-tabs__item {
              height: 50px;
              line-height: 50px;
              font-size: 16px;
              padding: 0 15px;
            }
            
            .projects-grid {
              grid-template-columns: 1fr;
              gap: 20px;
              
              .project-card {
                .project-header {
                  .project-title {
                    font-size: 16px;
                  }
                }
                
                .project-description {
                  p {
                    font-size: 13px;
                  }
                }
                
                .project-icon {
                  i {
                    font-size: 30px;
                  }
                }
              }
            }
          }
        }

        .section-card {
          .card-header {
            padding: 15px 20px;
            font-size: 18px;

            i {
              font-size: 20px;
            }
          }

          .card-content {
            padding: 20px;
          }
        }

        .rules-card {
          .card-content {
            padding: 20px;

            ::v-deep .el-timeline {
              .el-timeline-item {
                .el-timeline-item__timestamp {
                  font-size: 14px;
                }

                .rule-card {
                  p {
                    font-size: 14px;
                    padding: 12px;
                  }
                }
              }
            }
          }
        }

        .footer-decoration {
          .footer-text {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>