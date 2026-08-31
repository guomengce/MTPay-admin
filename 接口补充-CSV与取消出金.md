# CSV 导出与取消已完成出金

来源：用户本次提供的接口截图，补充旧版 `FRONTEND_AI_API_DOCUMENT(2).md` 未收录的接口。

全部接口携带管理端 Token。导出使用 GET Query，下载服务端文件，不用列表接口逐页拼接，不携带 page/limit。

| 路径 | Query 字段 |
| --- | --- |
| `/admin/exportDepositCsv` | keyword、started_at、ended_at |
| `/admin/exportExchangeCsv` | status、keyword、started_at、ended_at |
| `/admin/exportWhitelistCsv` | role、entity_type、keyword |
| `/admin/exportWithdrawalCsv` | status、keyword、started_at、ended_at |

日期格式为 YYYY-MM-DD。前端传递当前列表最近一次成功查询的筛选快照，并使用 URLSearchParams 编码到 GET URL；修改筛选框但尚未查询时，不改变导出范围。列表加载期间禁止导出。未选条件传空字符串，不预设状态。截图标注字段为必填，空字符串是否表示不筛选仍需实际接口联调验证。

兑换状态：0 待审核、1 已入账、2 已驳回。
出金状态：0 待审核、1 待补件、2 付款处理中、3 已完成、4 已驳回、5 付款失败、6 已取消。
白名单角色：1 付款人、2 收款人；主体类型：1 公司、2 个人。

## 取消已完成出金

`POST /admin/cancelCompletedWithdrawal`，按截图使用 multipart/form-data：

- id：必填，订单 ID。
- reason：可选，取消原因。

仅已完成订单显示入口；确认后调用，成功后重新获取列表或详情。截图未提供返回字段及具体资金处理规则，前端不推断退款或余额变动。
