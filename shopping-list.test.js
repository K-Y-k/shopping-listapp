// @ts-check
const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

const FILE_URL = `file:///${path.resolve(__dirname, 'shopping-list.html').replace(/\\/g, '/')}`;

test.describe('🛒 쇼핑 리스트 앱 테스트', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(FILE_URL);
    await page.evaluate(() => localStorage.removeItem('shoppingList'));
    await page.reload();
  });

  test('[초기 상태] 빈 상태 메시지가 표시된다', async ({ page }) => {
    const empty = page.locator('#empty');
    await expect(empty).toBeVisible();
    await expect(empty).toContainText('아직 아이템이 없어요');
    const stats = page.locator('#stats');
    await expect(stats).toBeHidden();
  });

  test('[추가] 추가 버튼을 클릭하면 아이템이 리스트에 나타난다', async ({ page }) => {
    await page.fill('#itemInput', '사과');
    await page.click('#addBtn');
    const items = page.locator('#list li');
    await expect(items).toHaveCount(1);
    await expect(items.first().locator('.item-name')).toHaveText('사과');
    await expect(page.locator('#empty')).toBeHidden();
    await expect(page.locator('#stats')).toBeVisible();
    await expect(page.locator('#statsText')).toContainText('총 1개');
  });

  test('[추가] Enter 키로 아이템을 추가할 수 있다', async ({ page }) => {
    await page.fill('#itemInput', '바나나');
    await page.press('#itemInput', 'Enter');
    const items = page.locator('#list li');
    await expect(items).toHaveCount(1);
    await expect(items.first().locator('.item-name')).toHaveText('바나나');
  });

  test('[추가] 여러 아이템을 추가하면 최신 항목이 맨 위에 온다', async ({ page }) => {
    for (const name of ['우유', '달걀', '빵']) {
      await page.fill('#itemInput', name);
      await page.click('#addBtn');
    }
    const items = page.locator('#list li .item-name');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toHaveText('빵');
    await expect(items.nth(1)).toHaveText('달걀');
    await expect(items.nth(2)).toHaveText('우유');
    await expect(page.locator('#statsText')).toContainText('총 3개');
  });

  test('[추가] 빈 입력값으로는 추가되지 않는다', async ({ page }) => {
    await page.fill('#itemInput', '   ');
    await page.click('#addBtn');
    await expect(page.locator('#list li')).toHaveCount(0);
    await expect(page.locator('#empty')).toBeVisible();
  });

  test('[체크] 체크박스를 클릭하면 아이템이 완료 상태가 된다', async ({ page }) => {
    await page.fill('#itemInput', '치즈');
    await page.click('#addBtn');
    const li = page.locator('#list li').first();
    const checkbox = li.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();
    await expect(li).not.toHaveClass(/checked/);
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await expect(li).toHaveClass(/checked/);
    await expect(page.locator('#statsText')).toContainText('완료 1개');
  });

  test('[체크] 아이템 텍스트를 클릭해도 체크/해제가 된다', async ({ page }) => {
    await page.fill('#itemInput', '요거트');
    await page.click('#addBtn');
    const li = page.locator('#list li').first();
    const itemName = li.locator('.item-name');
    await itemName.click();
    await expect(li).toHaveClass(/checked/);
    await itemName.click();
    await expect(li).not.toHaveClass(/checked/);
  });

  test('[체크] 완료 카운트가 정확하게 표시된다', async ({ page }) => {
    for (const name of ['A', 'B', 'C']) {
      await page.fill('#itemInput', name);
      await page.click('#addBtn');
    }
    const checkboxes = page.locator('#list li input[type="checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();
    await expect(page.locator('#statsText')).toContainText('총 3개 · 완료 2개');
  });

  test('[삭제] ✕ 버튼으로 아이템을 삭제할 수 있다', async ({ page }) => {
    await page.fill('#itemInput', '삭제할 아이템');
    await page.click('#addBtn');
    await expect(page.locator('#list li')).toHaveCount(1);
    await page.locator('#list li .delete-btn').first().click();
    await expect(page.locator('#list li')).toHaveCount(0);
    await expect(page.locator('#empty')).toBeVisible();
    await expect(page.locator('#stats')).toBeHidden();
  });

  test('[삭제] 여러 아이템 중 하나만 삭제해도 나머지는 유지된다', async ({ page }) => {
    for (const name of ['아이템1', '아이템2', '아이템3']) {
      await page.fill('#itemInput', name);
      await page.click('#addBtn');
    }
    await page.locator('#list li .delete-btn').nth(1).click();
    const items = page.locator('#list li .item-name');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toHaveText('아이템3');
    await expect(items.nth(1)).toHaveText('아이템1');
    await expect(page.locator('#statsText')).toContainText('총 2개');
  });

  test('[일괄삭제] 완료 항목만 삭제된다', async ({ page }) => {
    for (const name of ['사과', '바나나', '포도']) {
      await page.fill('#itemInput', name);
      await page.click('#addBtn');
    }
    const checkboxes = page.locator('#list li input[type="checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(2).click();
    await page.click('#clearBtn');
    const items = page.locator('#list li .item-name');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toHaveText('바나나');
    await expect(page.locator('#statsText')).toContainText('총 1개');
  });

  test('[저장] 페이지를 새로고침해도 아이템이 유지된다', async ({ page }) => {
    await page.fill('#itemInput', '지속 아이템');
    await page.click('#addBtn');
    await page.reload();
    const items = page.locator('#list li .item-name');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toHaveText('지속 아이템');
  });

  test('[접근성] 삭제 버튼에 aria-label이 아이템 이름을 포함한다', async ({ page }) => {
    await page.fill('#itemInput', '접근성테스트');
    await page.click('#addBtn');
    const deleteBtn = page.locator('#list li .delete-btn').first();
    await expect(deleteBtn).toHaveAttribute('aria-label', '접근성테스트 삭제');
  });

});