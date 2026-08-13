<template>
  <section class="login-brand">
    <div class="login-brand__content">
      <div class="login-brand__brand">
        <span>M</span>
        <strong>MTPay Admin</strong>
      </div>
      <p class="login-brand__eyebrow">OPERATIONS &amp; REVIEW CONSOLE</p>
      <h1>集中管理代理与<br />每一笔资金流程。</h1>
      <p class="login-brand__subtitle">
        从代理配置到资金审核，在一个安全、清晰的工作台中完成全部运营流程。
      </p>

      <div class="login-brand__features">
        <article>
          <span>01</span>
          <div>
            <strong>集中管控</strong>
            <small>代理、费率与权限统一管理</small>
          </div>
        </article>
        <article>
          <span>02</span>
          <div>
            <strong>全程可追溯</strong>
            <small>关键操作与资金流转清晰留痕</small>
          </div>
        </article>
      </div>

      <p class="login-brand__slogan">
        <i aria-hidden="true" /> SECURE · EFFICIENT · TRACEABLE
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login-brand {
  position: relative;
  width: 100%;
  min-height: 100vh;
  color: #fff;
  background:
    linear-gradient(90deg, rgb(255 255 255 / 8%) 1px, transparent 1px),
    linear-gradient(0deg, rgb(255 255 255 / 8%) 1px, transparent 1px),
    radial-gradient(circle at 78% 18%, rgb(18 126 203 / 38%), transparent 42%),
    linear-gradient(145deg, #03142f, #063968);
  background-size: 96px 96px, 96px 96px, auto, auto;

  &__content {
    padding: clamp(64px, 8vh, 110px) clamp(48px, 7vw, 120px);
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: clamp(90px, 18vh, 190px);

    span {
      display: grid;
      width: 64px;
      height: 64px;
      place-items: center;
      border-radius: 16px;
      color: #032044;
      background: linear-gradient(135deg, #31d9c5, #0aaebc);
      font-size: 34px;
      font-weight: 950;
    }

    strong { font-size: 34px; }
  }

  &__eyebrow {
    margin: 0 0 34px;
    color: #20eee0;
    font-size: 17px;
    font-weight: 900;
    letter-spacing: 8px;
  }

  h1 {
    margin: 0;
    font-size: clamp(44px, 4.25vw, 64px);
    font-weight: 950;
    line-height: 1.28;
  }

  &__subtitle {
    max-width: 620px;
    margin: 26px 0 0;
    color: rgb(220 235 250 / 82%);
    font-size: 17px;
    font-weight: 550;
    line-height: 1.8;
  }

  &__features {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    max-width: 650px;
    margin-top: 32px;

    article {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 16px 18px;
      border: 1px solid rgb(130 190 230 / 20%);
      border-radius: 14px;
      background: linear-gradient(135deg, rgb(255 255 255 / 8%), rgb(255 255 255 / 3%));
      backdrop-filter: blur(8px);
    }

    article > span {
      color: #23e6d7;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 1px;
    }

    article div { display: grid; gap: 4px; }
    strong { font-size: 15px; }
    small { color: rgb(217 233 248 / 66%); font-size: 11px; }
  }

  &__slogan {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 25px 0 0;
    color: rgb(181 210 235 / 60%);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 3px;

    i {
      width: 28px;
      height: 2px;
      background: #1edccc;
    }
  }

  @include mobile {
    width: 100%;
    min-height: 330px;
    background-size: 54px 54px, 54px 54px, auto, auto;

    &::after {
      position: absolute;
      z-index: 0;
      right: -8%;
      bottom: -34px;
      left: -8%;
      height: 74px;
      border-radius: 0 0 50% 50%;
      background: #063463;
      content: '';
    }

    &__content {
      position: relative;
      z-index: 1;
      padding: 42px 32px 116px;
    }

    &__brand {
      gap: 13px;
      margin-bottom: 70px;

      span {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        font-size: 26px;
      }

      strong { font-size: 24px; }
    }

    &__eyebrow {
      margin-bottom: 22px;
      font-size: 10px;
      letter-spacing: 4px;
      white-space: nowrap;
    }

    h1 { font-size: clamp(32px, 9vw, 46px); line-height: 1.25; }

    &__subtitle,
    &__features,
    &__slogan { display: none; }
  }
}
</style>
