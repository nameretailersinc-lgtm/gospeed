import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async({context})=>{await context.addInitScript(()=>localStorage.setItem('gospeed-privacy-v1','essential'));});
test('all desktop explorers filter, fit the viewport and support keyboard navigation',async({page},info)=>{
 test.skip(info.project.name!=='desktop','Desktop dropdowns use mobile navigation at smaller widths.');test.setTimeout(120000);
 await page.goto('/');
 for(const label of ['Calculators','Engineering Guides','Reference Charts','Tools']){
  const details=page.getByRole('navigation',{name:'Main navigation'}).locator('details').filter({has:page.locator('summary').filter({hasText:new RegExp('^'+label+'$')})});
  await details.locator('summary').click();const panel=details.locator('.dropdown-panel');await expect(panel).toBeVisible();
  expect(await panel.evaluate(e=>e.scrollWidth<=e.clientWidth),label).toBe(true);expect(await panel.evaluate(e=>e.getBoundingClientRect().left>=0&&e.getBoundingClientRect().right<=innerWidth),label).toBe(true);
  await details.getByRole('tab').first().focus();await page.keyboard.press('ArrowDown');await expect(details.getByRole('tab').nth(1)).toBeFocused();await expect(details.getByRole('tab').nth(1)).toHaveAttribute('aria-selected','true');
  const result=await new AxeBuilder({page}).include('.site-header').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),label).toEqual([]);
  await page.screenshot({path:`docs/evidence/navigation-${label.toLowerCase().replaceAll(' ','-')}.png`});await page.keyboard.press('Escape');await expect(panel).not.toBeVisible();await expect(details.locator('summary')).toBeFocused();
 }
 await page.keyboard.press('/');await expect(page.getByRole('searchbox',{name:'Search tools',exact:true})).toBeFocused();
});

test('navbar fits intermediate widths and mobile destinations remain accessible',async({page})=>{
 for(const width of [390,768,821,1024,1280,1536]){
  await page.setViewportSize({width,height:1000});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),String(width)).toBe(true);
  if(width>=1001){const summary=page.locator('.calculator-dropdown summary');await summary.click();expect(await page.locator('.mega-calculator-menu').evaluate(e=>e.scrollWidth<=e.clientWidth),String(width)).toBe(true);await page.keyboard.press('Escape');}
  else {await page.getByRole('button',{name:'Open navigation'}).click();await expect(page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Engineering guides'})).toBeVisible();await page.keyboard.press('Escape');}
 }
});
