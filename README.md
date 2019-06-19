# このアプリについて

typescript学習目的で作成したライフゲームアプリケーションです。  
ts + react + eslint + prettierで快適な開発を目指しています。  
render props、containerとpresentationalの分離を強く意識した構成になっています。  

https://vigilant-pike-739058.netlify.com


### render propsについて

再利用性を高める実装手法の一つです。vue.jsでいうscoped slotsと類似しています。  
状態、ロジックとビューを分離しプロジェクトの管理しやすさを保ちます。  

``` js
type ChildProps = {
  // 子に渡したいpropsの型を定義
}

// 親コンポーネントで `render` propsを呼び出す 
const Parent = ({ render }) => (
  <div>
    {render(子に渡したいpropsを書く)}
  </div>
)

// 親コンポーネントに render という props を追加
// propsをつけた子コンポーネントを返す
const SomeWrapperComponent => () => (
  <Parent render={ props: ChildProps => <Child { ...props } /> } />
)
```

今後はcustom hooksが取って代わって行くかと思いますが、  
コンポーネントの再利用性を高めたり、custom hooksの考え方の理解に非常に役立つ実装手法です。

### 主な参考資料

* ベース資料 ts + react + webpack環境構築
https://qiita.com/fisherman3110se/items/918d6ef4244f7b4558ca  

* @typescript-eslintについて
http://watanabeyu.blogspot.com/2019/02/typescript-eslinttypescriptlinteslintai.html  

* vscode用の設定  
https://qiita.com/karak/items/12811d235b0d8bc8ad00#vs-code

* .ts/tsxインポート時に `eslint(import/no-unresolved)` が出る時の対処
https://qiita.com/euxn23/items/e2b9226ab1e02a9b1f20  
https://github.com/alexgorbatchev/eslint-import-resolver-typescript

* Module not found: Error: Can't resolve '.tsファイル'
https://stackoverflow.com/questions/43595555/webpack-cant-resolve-typescript-modules
