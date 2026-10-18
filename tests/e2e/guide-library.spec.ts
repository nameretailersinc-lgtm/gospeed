import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async({context})=>{await context.addInitScript(()=>localStorage.setItem('gospeed-privacy-v1','essential'));});

test('guide library combines topic, level, type, search and sort filters',async({page},info)=>{
 await page.goto('/guides');await page.evaluate(()=>document.fonts.ready);
 const cards=page.locator('.image-library-card');const filters=page.getByRole('complementary',{name:'Guide filters'});
 await expect(cards).toHaveCount(15);await expect(page.getByRole('status')).toContainText('30 guides');
 await expect(page.locator('.guide-card-meta').first()).toContainText('min read');
 await filters.getByRole('checkbox',{name:/Intermediate/}).check();await expect(page.getByRole('status')).toContainText('7 guides');
 await filters.getByRole('checkbox',{name:/How-to guide/}).check();await expect(cards).toHaveCount(1);await expect(cards).toContainText('gear ratio from RPM');
 await page.getByRole('button',{name:'Clear filters',exact:true}).click();
 await page.getByRole('group',{name:'Filter guides by topic'}).getByRole('button',{name:'Motorcycle',exact:true}).click();await expect(cards).toHaveCount(4);
 await page.getByRole('searchbox',{name:'Search engineering guides'}).fill('highway');await expect(cards).toHaveCount(1);
 await page.getByRole('button',{name:'Clear filters',exact:true}).click();await page.getByRole('combobox',{name:'Sort by'}).selectOption('title');await expect(cards.first()).toContainText('Chain drive calculations');
 await page.getByRole('searchbox',{name:'Search engineering guides'}).fill('not-a-real-topic');await expect(page.getByRole('heading',{name:'No matching guides'})).toBeVisible();
 await page.locator('.empty-state').getByRole('button',{name:'Clear filters'}).click();await expect(cards).toHaveCount(15);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('combobox',{name:'Sort by'}).selectOption('featured');
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`docs/evidence/guide-library-${info.project.name}.png`,fullPage:true});
});

test('guide pagination reaches all 30 articles and page two works without JavaScript',async({page,browser},info)=>{
 await page.goto('/guides');const first=await page.locator('.image-library-card').evaluateAll(cards=>cards.map(c=>c.getAttribute('href')));
 await page.getByRole('link',{name:'Next guide page'}).click();await expect(page.getByRole('link',{name:'Guide page 2',exact:true})).toHaveAttribute('aria-current','page');
 const second=await page.locator('.image-library-card').evaluateAll(cards=>cards.map(c=>c.getAttribute('href')));expect(new Set([...first,...second]).size).toBe(30);
 await page.getByRole('link',{name:'Previous guide page'}).click();await expect(page.locator('.image-library-card').first()).toHaveAttribute('href',first[0]!);
 const context=await browser.newContext({javaScriptEnabled:false,viewport:info.project.use.viewport});const fallback=await context.newPage();await fallback.goto('http://127.0.0.1:3107/guides?page=2');await expect(fallback.locator('.image-library-card')).toHaveCount(15);await expect(fallback.locator('.image-library-card').first()).toHaveAttribute('href',second[0]!);await context.close();
});

test('illustrated resource menus expose real destinations and no horizontal scroll',async({page},info)=>{
 test.skip(info.project.name!=='desktop','Desktop explorers are replaced by mobile navigation.');test.setTimeout(90000);
 await page.setViewportSize({width:1600,height:1000});await page.goto('/');
 for(const [kind,label] of [['guides','Engineering Guides'],['reference','Reference Charts'],['tools','Tools']]){
  const details=page.getByRole('navigation',{name:'Main navigation'}).locator('details').filter({has:page.locator('summary').filter({hasText:new RegExp('^'+label+'$')})});
  await details.locator('summary').click();const panel=page.locator(`.resource-menu-${kind}`);await expect(panel).toBeVisible();await expect(panel.locator('.resource-menu-card')).toHaveCount(6);
  for(const image of await panel.locator('.resource-card-photo img').all()){await expect(image).toHaveJSProperty('complete',true);expect(await image.evaluate((e:HTMLImageElement)=>e.naturalWidth)).toBeGreaterThan(0);}
  expect(await panel.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  await page.screenshot({path:`docs/evidence/resource-explorer-${kind}.png`});await page.keyboard.press('Escape');await expect(details.locator('summary')).toBeFocused();
 }
});
