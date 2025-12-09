# pnpm-lock.yaml 与 package.json 版本不一致演示

## 当前不一致状态

我已经模拟了一个版本不一致的场景：

### package.json 中的版本
```json
{
  "devDependencies": {
    "typescript": "^5.9.0"      // ← 已更新为 ^5.9.0
  }
}
```

### pnpm-lock.yaml 中的版本
```yaml
devDependencies:
  typescript:
    specifier: ^5               # ← 仍然是 ^5（不一致！）
    version: 5.9.3
```

**注意**：虽然实际安装的版本 `5.9.3` 满足 `^5.9.0` 的要求，但 `specifier` 字段（记录 package.json 中的版本范围）不一致，这会导致 pnpm 检测到版本不匹配。

## 如何检测不一致

### 方法 1: 使用 --frozen-lockfile 标志
```bash
pnpm install --frozen-lockfile
```

**实际输出：**
```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because 
pnpm-lock.yaml is not up to date with package.json

Failure reason:
specifiers in the lockfile ({"typescript":"^5",...}) 
don't match specs in package.json ({"typescript":"^5.9.0",...})
```

### 方法 2: 直接运行 pnpm install
```bash
pnpm install
```
如果 lock 文件与 package.json 不一致，pnpm 会自动检测并提示更新。

## 如何修复不一致

### 方法 1: 重新安装（推荐）
```bash
pnpm install
```
这会自动更新 `pnpm-lock.yaml` 以匹配 `package.json`。

### 方法 2: 删除并重新生成 lock 文件
```bash
rm pnpm-lock.yaml
pnpm install
```

### 方法 3: 更新特定依赖
```bash
pnpm update typescript
```

## 常见导致不一致的原因

1. **手动编辑了 package.json 但忘记运行 install**
   - ✅ 修改 package.json 后必须运行 `pnpm install`

2. **手动编辑了 pnpm-lock.yaml**
   - ❌ 永远不要手动编辑 lock 文件
   - ✅ 让 pnpm 自动管理

3. **在不同分支间切换**
   - 不同分支可能有不同的依赖版本
   - 切换分支后运行 `pnpm install`

4. **使用 --no-lockfile 安装**
   - 这会跳过 lock 文件生成
   - 避免在生产环境使用

5. **依赖冲突导致版本调整**
   - pnpm 可能选择不同的版本来解决冲突
   - 运行 `pnpm install` 同步

## 验证修复

修复后，运行以下命令验证：
```bash
pnpm install --frozen-lockfile
```

如果成功（没有错误），说明版本已同步。

## 当前演示状态

当前项目处于**不一致状态**，用于演示目的。要修复，请运行：
```bash
pnpm install
```

