<template>
  <div class="about-container">
    <div class="content-wrapper">
      <!-- <div class="top-container">
        <el-page-header @back="goBack" content="关于我们"></el-page-header>
      </div> -->

      <div class="main-content">
        <!-- 公司头部信息 -->
        <div class="company-header">
          <div class="logo-section">
            <div class="logo-placeholder">
              <i class="el-icon-office-building"></i>
            </div>
          </div>
          <div class="company-info">
            <h1 class="company-name">厦门科睿通教育科技有限公司</h1>
            <p class="company-slogan">专注医学教育科技，引领数字教学未来</p>
          </div>
        </div>

        <!-- 公司介绍卡片 -->
        <div class="intro-section">
          <el-row :gutter="30">
            <el-col :span="24">
              <el-card class="intro-card mission-card">
                <div slot="header" class="card-header">
                  <i class="el-icon-lightning"></i>
                  <span>公司使命</span>
                </div>
                <div class="card-content">
                  <p>专精于医学教学领域信息技术实训应用的研究，为各大院校提供量身开发的教学新媒体应用解决方案。</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 核心优势 -->
        <el-card class="section-card advantages-card">
          <div slot="header" class="card-header">
            <i class="el-icon-star-off"></i>
            <span>核心优势</span>
          </div>
          <div class="card-content">
            <el-row :gutter="20">
              <el-col :span="12" :xs="24" v-for="(advantage, index) in advantages" :key="index">
                <div class="advantage-item">
                  <div class="advantage-icon">
                    <i :class="advantage.icon"></i>
                  </div>
                  <div class="advantage-content">
                    <h3>{{ advantage.title }}</h3>
                    <p>{{ advantage.description }}</p>
              </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <!-- 团队介绍 -->
        <el-card class="section-card team-card">
          <div slot="header" class="card-header">
            <i class="el-icon-user-solid"></i>
            <span>团队实力</span>
          </div>
          <div class="card-content">
            <div class="team-content">
              <p class="team-description">我司汇集了一批专业技术领域的优秀人才，组成了以青年科技精英骨干和医学教育专家共同协作的高素质科研团队。</p>
              <div class="team-features">
                <el-row :gutter="20">
                  <el-col :span="8" :xs="24">
                    <div class="feature-item">
                      <div class="feature-icon">
                        <i class="el-icon-s-check"></i>
                      </div>
                      <h4>专业严谨</h4>
                      <p>以严谨专业的态度对待每一个项目</p>
                    </div>
                  </el-col>
                  <el-col :span="8" :xs="24">
                    <div class="feature-item">
                      <div class="feature-icon">
                        <i class="el-icon-refresh"></i>
                      </div>
                      <h4>持续创新</h4>
                      <p>不断探索教育科技新领域</p>
                    </div>
                  </el-col>
                  <el-col :span="8" :xs="24">
                    <div class="feature-item">
                      <div class="feature-icon">
                        <i class="el-icon-trophy"></i>
                      </div>
                      <h4>经验丰富</h4>
                      <p>积累了丰富的产品设计经验</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 服务承诺 -->
        <el-card class="section-card service-card">
          <div slot="header" class="card-header">
            <i class="el-icon-service"></i>
            <span>服务承诺</span>
          </div>
          <div class="card-content">
            <div class="service-content">
              <el-row :gutter="30">
                <el-col :span="12" :xs="24">
                  <div class="service-item">
                    <h3>品质保证</h3>
                    <p>注重产品品质和实用性，确保每一个解决方案都能满足客户需求</p>
                  </div>
                </el-col>
                <el-col :span="12" :xs="24">
                  <div class="service-item">
                    <h3>完善售后</h3>
                    <p>具备完善的售后服务体系，为客户提供最佳的服务质量和速度</p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>

        <!-- 成功案例 -->
        <el-card class="section-card cases-card">
          <div slot="header" class="card-header">
            <i class="el-icon-medal"></i>
            <span>成功应用</span>
          </div>
          <div class="card-content">
            <div class="cases-content">
              <p>提供多套软硬件结合的数字教学方案，并已经在多个教研实验室成功应用。</p>
              <div class="cases-stats">
                <div class="stat-item">
                  <div class="stat-number">多个</div>
                  <div class="stat-label">教研实验室</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">多套</div>
                  <div class="stat-label">数字教学方案</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">各大院校</div>
                  <div class="stat-label">成功服务</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      advantages: [
        {
          icon: 'el-icon-monitor',
          title: '技术创新',
          description: '专注医学教学领域信息技术研发 持续推动教育科技发展'
        },
        {
          icon: 'el-icon-setting',
          title: '定制方案',
          description: '为各大院校量身开发教学新媒体应用解决方案'
        },
        {
          icon: 'el-icon-data-line',
          title: '实训应用',
          description: '专精于信息技术实训应用研究，注重实践效果'
        },
        {
          icon: 'el-icon-s-platform',
          title: '软硬结合',
          description: '提供多套软硬件结合的完整数字教学方案'
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.about-container {
  background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
  min-height: calc(100vh - 61px);
  padding: 20px 0;

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    .main-content {
      // 公司头部信息
      .company-header {
        background: white;
        border-radius: 16px;
        padding: 40px;
        margin-bottom: 30px;
        text-align: center;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        position: relative;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #409EFF, #1e88e5);
        }

        .logo-section {
          margin-bottom: 25px;

          .logo-placeholder {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #409EFF, #1e88e5);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            box-shadow: 0 8px 25px rgba(30, 136, 229, 0.3);

            i {
              font-size: 60px;
              color: white;
            }
          }
        }

        .company-info {
          .company-name {
            color: #333;
            font-size: 32px;
            margin-bottom: 15px;
            font-weight: 700;
          }

          .company-slogan {
            color: #409EFF;
            font-size: 20px;
            font-weight: 500;
          }
        }
      }

      // 介绍卡片
      .intro-section {
        margin-bottom: 30px;

        .intro-card {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          border: none;

          &.mission-card {
            .card-header {
              background: linear-gradient(90deg, #64b5f6 0%, #1976d2 100%);
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
              padding: 30px;

              p {
                font-size: 18px;
                line-height: 1.7;
                color: #555;
                text-align: center;
              }
            }
          }
        }
      }

      // 通用卡片样式
      .section-card {
        margin-bottom: 30px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
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
          padding: 30px;
        }
      }

      // 核心优势卡片
      .advantages-card {
        .advantage-item {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 25px 0;
          padding: 20px;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: #f8fafc;

          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            background: white;
          }

          &:last-child {
            margin-bottom: 0;
          }

          .advantage-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #409EFF, #1e88e5);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            i {
              font-size: 28px;
              color: white;
            }
          }

          .advantage-content {
            flex: 1;
            h3 {
              color: #333;
              font-size: 20px;
              margin-bottom: 10px;
              font-weight: 600;
            }

            p {
              color: #666;
              font-size: 16px;
              line-height: 1.6;
            }
          }
        }
      }

      // 团队介绍卡片
      .team-card {
        .team-content {
          .team-description {
            font-size: 18px;
            line-height: 1.7;
            color: #555;
            margin-bottom: 30px;
            text-align: center;
            font-weight: 500;
          }

          .team-features {
            .feature-item {
              text-align: center;
              padding: 25px 15px;
              border-radius: 12px;
              transition: all 0.3s ease;

              &:hover {
                background: #f0f8ff;
                transform: translateY(-3px);
              }

              .feature-icon {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: linear-gradient(135deg, #64b5f6, #1976d2);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                box-shadow: 0 6px 15px rgba(100, 181, 246, 0.3);

                i {
                  font-size: 32px;
                  color: white;
                }
              }

              h4 {
                color: #333;
                font-size: 18px;
                margin-bottom: 10px;
                font-weight: 600;
              }

              p {
                color: #666;
                font-size: 15px;
                line-height: 1.5;
              }
            }
          }
        }
      }

      // 服务承诺卡片
      .service-card {
        .service-content {
          .service-item {
            padding: 25px;
            border-radius: 12px;
            background: #f8fafc;
            margin-bottom: 20px;
            transition: all 0.3s ease;

            &:hover {
              background: #e3f2fd;
              transform: translateY(-3px);
            }

            &:last-child {
              margin-bottom: 0;
            }

            h3 {
              color: #1e88e5;
              font-size: 22px;
              margin-bottom: 15px;
              font-weight: 600;
            }

            p {
              color: #555;
              font-size: 16px;
              line-height: 1.6;
            }
          }
        }
      }

      // 成功案例卡片
      .cases-card {
        .cases-content {
          p {
            font-size: 18px;
            line-height: 1.7;
            color: #555;
            text-align: center;
            margin-bottom: 30px;
            font-weight: 500;
          }

          .cases-stats {
            display: flex;
            justify-content: center;
            gap: 40px;
            flex-wrap: wrap;

            .stat-item {
              text-align: center;
              padding: 20px;

              .stat-number {
                font-size: 28px;
                font-weight: 700;
                color: #1e88e5;
                margin-bottom: 10px;
              }

              .stat-label {
                font-size: 16px;
                color: #666;
                font-weight: 500;
              }
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .about-container {
    .content-wrapper {
      padding: 0 15px;

      .main-content {
        .company-header {
          padding: 30px 20px;

          .logo-section {
            .logo-placeholder {
              width: 80px;
              height: 80px;

              i {
                font-size: 40px;
              }
            }
          }

          .company-info {
            .company-name {
              font-size: 24px;
            }

            .company-slogan {
              font-size: 16px;
            }
          }
        }

        .intro-section,
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

        .advantages-card {
          .advantage-item {
            flex-direction: column;
            text-align: center;
            padding: 15px;

            .advantage-content {
              h3 {
                font-size: 18px;
              }

              p {
                font-size: 14px;
              }
            }
          }
        }

        .team-card {
          .team-content {
            .team-description {
              font-size: 16px;
            }

            .team-features {
              .el-col {
                margin-bottom: 20px;
              }
            }
          }
        }

        .service-card {
          .service-content {
            .service-item {
              padding: 20px;

              h3 {
                font-size: 18px;
              }

              p {
                font-size: 14px;
              }
            }
          }
        }

        .cases-card {
          .cases-content {
            p {
              font-size: 16px;
            }

            .cases-stats {
              gap: 20px;

              .stat-item {
                .stat-number {
                  font-size: 22px;
                }

                .stat-label {
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>