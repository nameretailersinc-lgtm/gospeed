import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async({context})=>{await context.addInitScript(()=>localStorage.setItem('gospeed-privacy-v1','essential'));});
test('drivetrain reference keeps its live inputs, range and explanatory layout',async({page},info)=>{
 test.setTimeout(90000);await page.goto('/reference/drivetrain-loss-sensitivity');await page.evaluate(()=>document.fonts.ready);
 await expect(page.locator('h1')).toHaveText('Drivetrain loss sensitivity table');await expect(page.locator('.reference-live-summary')).toContainText('280–400 hp');
 await page.locator('#power').fill('500');await expect(page.locator('tbody tr').last()).toContainText('350');await expect(page.locator('.reference-live-summary')).toContainText('350–500 hp');
 await page.getByRole('button',{name:'Metric',exact:true}).click();await expect(page.locator('tbody tr').last()).toContainText('350');
 await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(page.locator('.reference-live-summary')).toContainText('280–400 hp');
 await page.locator('#power').fill('-1');await expect(page.locator('#reference-error')).toBeVisible();await expect(page.locator('tbody')).toHaveCount(0);await page.getByRole('button',{name:'Reset',exact:true}).click();
 await page.locator('.table-scroll').focus();await expect(page.locator('.table-scroll')).toBeFocused();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.reference-faq-section summary').first().click();await expect(page.locator('.reference-faq-section details p').first()).toBeVisible();
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`docs/evidence/reference-drivetrain-detail-${info.project.name}.png`,fullPage:true});
});

test('finder tabs offer keyboard navigation and useful destinations',async({page},info)=>{
 await page.goto('/');const finder=page.getByRole('region',{name:'Find racing tools'});await finder.scrollIntoViewIfNeeded();
 await page.getByRole('tab',{name:'Find a Calculator',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{name:'Browse by Category',exact:true})).toBeFocused();await expect(finder.getByRole('tabpanel').getByRole('link',{name:'Go-kart',exact:true})).toBeVisible();
 await page.keyboard.press('ArrowRight');await expect(finder.locator('.finder-featured-panel a')).toHaveCount(6);await page.keyboard.press('End');await expect(finder.getByRole('link',{name:'Browse 30 guides'})).toBeVisible();
 await page.getByRole('tab',{name:'Find a Calculator',exact:true}).click();await expect(finder.getByRole('searchbox',{name:'Search calculators',exact:true})).toBeVisible();
 expect(await finder.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);await page.screenshot({path:`docs/evidence/finder-${info.project.name}.png`});
});
