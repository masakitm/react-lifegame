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


### renderpropsについて

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