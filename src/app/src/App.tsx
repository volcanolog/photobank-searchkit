import * as React from "react";
import * as _ from "lodash";
const BEMBlock = require("bem-cn")

import {
  SearchBox,
  Hits,
  HitsStats,
  RefinementListFilter,
  Pagination,
  ResetFilters,
  MenuFilter,
  SelectedFilters,
  Toggle,
  HierarchicalMenuFilter,
  NumericRefinementListFilter,
  PageSizeSelector,
  SortingSelector,
  SearchkitComponent,
  SearchkitProvider,
  SearchkitManager,
  NoHits,
  RangeFilter,
  InitialLoader,
  ViewSwitcherToggle,
  ViewSwitcherHits,
  Layout, LayoutBody, LayoutResults,
  SideBar, TopBar,
  ActionBar, ActionBarRow
} from "searchkit";

import "./../styles/customisations.scss";
import "searchkit/theming/theme.scss";

import {MovieHitsGridItem, MovieHitsListItem} from "./ResultComponents"


export class App extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super()
    const host = "/api/movies"
    this.searchkit = new SearchkitManager(host)
    this.searchkit.translateFunction = (key)=> {
      return {
        "pagination.next":"Следующая",
        "pagination.previous":"Предыдущая",
        "searchbox.placeholder":"наберите не меньше трех знаков, чтобы начать поиск",
        "hitstats.results_found":"{hitCount} найдено",
        "facets.view_more":"Показать больше",
        "facets.view_all":"Показать все",
        "facets.view_less":"Показать меньше"
      }[key]
    }
  }


  render(){

    return (
      <SearchkitProvider searchkit={this.searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">МИР24 фотобанк</div>
            <SearchBox
              translations={{"searchbox.placeholder":"type at least 3 characters for image search"}}
              queryOptions={{"minimum_should_match":"70%"}}
              autofocus={true}
              searchOnChange={true}
              queryFields={["actors^1","type^2","languages","title^5", "genres^2", "plot", "author", "short_url", "original_filename"]}/>
          </TopBar>

          <LayoutBody>

      			<SideBar>
      				<HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
              <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="Metascore" showHistogram={true}/>
              <RangeFilter min={1000} max={3000} field="exifimagelength" id="exifimagelength" title="Высота изображения" showHistogram={true}/>
              <RangeFilter min={1000} max={3000} field="exifimagewidth" id="exifimagewidth" title="Ширина изображения" showHistogram={true}/>
              <RefinementListFilter operator="OR" id="author" title="Автор" field="author.raw" size={10}/>
      				<RefinementListFilter translations={{"facets.view_more":"View more writers"}} id="writers" title="Writers" field="writers.raw" operator="OR" size={10}/>
      				<RefinementListFilter id="countries" title="Countries" field="countries.raw" operator="OR" size={10}/>
              <NumericRefinementListFilter id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
                {title:"All"},
                {title:"up to 20", from:0, to:20},
                {title:"21 to 60", from:21, to:60},
                {title:"60 or more", from:61, to:1000}
              ]}/>
            </SideBar>

      			<LayoutResults>

              <ActionBar>

                <ActionBarRow>
          				<HitsStats translations={{
                    "hitstats.results_found":"{hitCount} results found"
                  }}/>
		  <PageSizeSelector options={[4,12,24]} listComponent={Toggle}/>
			  <ViewSwitcherToggle/>
                </ActionBarRow>
                <ActionBarRow>
                  <SelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>

              </ActionBar>

              <ViewSwitcherHits
      				    hitsPerPage={12} highlightFields={["title","plot"]}
                  sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year", "short_url", "original_filename"]}
                  hitComponents = {[
                    {key:"grid", title:"Плитка", itemComponent:MovieHitsGridItem, defaultOption:true},
                    {key:"list", title:"Список", itemComponent:MovieHitsListItem}
                  ]}
                  scrollTo="body"
              />

              <NoHits suggestionsField={"title"}/>
              <InitialLoader/>
      				<Pagination showNumbers={true}/>
      			</LayoutResults>
          </LayoutBody>
    			<a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
    		</Layout>
      </SearchkitProvider>
	)}

}
